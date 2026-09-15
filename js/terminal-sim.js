/* =========================================================
   منصة 15 — محاكي طرفية تعليمي شامل (Kali / Termux Style)
   -----------------------------------------------------------
   محاكي حقيقي وتفاعلي بالكامل (وليس نصًا وهميًا ثابتًا)، لكنه:
   - يعمل بالكامل داخل المتصفح (نظامَي ملفات وهميَّين في الذاكرة:
     الجهاز المحلي وجهاز هدف تدريبي ثانٍ يُختَرق وهميًا).
   - لا يتصل بأي شبكة حقيقية ولا ينفّذ أي أمر فعلي على أي نظام
     خارجي أو جهاز المستخدم — كل أداة أمنية هنا (nmap, hydra,
     john, nikto, searchsploit...) تُظهر مخرجات "مُمثَّلة" ثابتة
     لغرض تعليم قراءة نتائجها وفهم منطقها فقط، وليست تنفيذًا حقيقيًا.
   - مصمَّم لتعليم: أوامر Linux الأساسية، مفهوم تثبيت أدوات Kali
     عبر apt، ومسار CTF تعليمي من مرحلتين (استغلال محلي ثم
     اختراق وهمي لجهاز هدف عبر SSH وتصعيد صلاحيات وهمي بسيط).
   ========================================================= */

(function(){

  const MOTD = {
    kali: `┌──(user㉿mansa15-lab)-[~]
Welcome to the Kali training simulator 🛡️
A fully isolated training environment — no real connection to any external network or system.
Type "help" to see all commands, or "start" to begin a two-stage CTF challenge.
Tools like hydra, john, or nikto need to be installed first: apt install <tool name>`,
    termux: `Welcome to Termux (simulated) 📱
بيئة Linux تعليمية للمبتدئين — محاكاة كاملة داخل المتصفح فقط.
أدوات الاختراق (hydra/john/nikto...) غير متاحة هنا — بدّل لوضع Kali للتدرّب عليها.
اكتب "help" لعرض الأوامر المتاحة.`
  };

  const KNOWN_TOOLS = ["hydra","john","nikto","searchsploit","aircrack-ng","sqlmap"];

  function freshFS(){
    return {
      name: "~", type: "dir", perms: "755", owner: "user",
      children: {
        "Desktop": { type: "dir", perms: "755", owner: "user", children: {} },
        "Documents": { type: "dir", perms: "755", owner: "user", children: {
          "notes.txt": { type: "file", perms: "644", owner: "user", content: "ملاحظات دروس منصة 15 📚" }
        }},
        "wordlist.txt": { type: "file", perms: "644", owner: "user",
          content: "123456\nadmin\npassword\nSummer2024!\nqwerty" },
        "challenge.txt": { type: "file", perms: "644", owner: "user",
          content: "🚩 المرحلة 1: العلم المحلي مخفي داخل secret_dir لكن الملف محمي.\nجرّب: ls -la secret_dir  ثم  cat secret_dir/flag.txt\n\n🚩 المرحلة 2: بعد إيجاد العلم الأول، اكتب start2 لبدء تحدي اختراق جهاز هدف تدريبي." },
        "secret_dir": { type: "dir", perms: "755", owner: "user", children: {
          "flag.txt": { type: "file", perms: "600", owner: "root", content: "flag{welcome_to_mansa15_labs}" }
        }},
        ".bash_history": { type: "file", perms: "644", owner: "user", content: "ls\ncat challenge.txt\nnmap 10.13.37.10" }
      }
    };
  }

  // جهاز الهدف التدريبي (يُصل إليه فقط عبر ssh بعد اجتياز التحدي)
  function freshTargetFS(){
    return {
      name: "~", type: "dir", perms: "755", owner: "webadmin",
      children: {
        "readme.txt": { type: "file", perms: "644", owner: "webadmin",
          content: "مرحبًا بك في السيرفر التدريبي! هذا نظام تدريبي مصمَّم خصيصًا لتعلّم أساسيات ما بعد الاختراق (Post-Exploitation) بأمان تام." },
        "backup.zip": { type: "file", perms: "644", owner: "webadmin", content: "(ملف تجريبي — لا يحتوي شيئًا حقيقيًا)" }
      }
    };
  }

  class TerminalSim {
    constructor(outEl, inputEl){
      this.out = outEl;
      this.input = inputEl;
      this.mode = "kali"; // kali | termux
      this.fs = freshFS();
      this.cwdPath = [];
      this.history = [];
      this.histIndex = -1;
      this.flagFound = false;
      this.installed = new Set(["nmap"]);
      this.stage2Started = false;
      this.hydraCredsFound = false;
      this.location = "local"; // local | remote
      this.remoteFS = freshTargetFS();
      this.remoteCwdPath = [];
      this.pendingInput = null; // لتلقّي إدخال خاص (مثل كلمة مرور ssh) بالسطر التالي
      this.boot();
      this.input.addEventListener("keydown", (e)=>{
        if(e.key === "Enter"){ this.submit(); }
        else if(e.key === "ArrowUp"){ e.preventDefault(); this.navHistory(-1); }
        else if(e.key === "ArrowDown"){ e.preventDefault(); this.navHistory(1); }
      });
    }

    boot(){
      this.out.innerHTML = "";
      this.printRaw(MOTD[this.mode]);
      this.printPromptLine();
    }

    setMode(mode){
      this.mode = mode;
      this.printRaw(`\n[تبديل الوضع إلى ${mode === "kali" ? "Kali 🛡️" : "Termux 📱"}]`);
      this.printRaw(MOTD[mode]);
      this.printPromptLine();
    }

    get promptStr(){
      if(this.location === "remote"){
        const path = "~" + (this.remoteCwdPath.length ? "/" + this.remoteCwdPath.join("/") : "");
        return `webadmin@target:${path}$`;
      }
      const path = "~" + (this.cwdPath.length ? "/" + this.cwdPath.join("/") : "");
      return this.mode === "kali" ? `root@mansa15-lab:${path}#` : `u0_a1@termux:${path}$`;
    }

    /* أجزاء البرومبت منفصلة لتلوينها بأسلوب Kali Linux (PS1 الشهير:
       مستخدم@مضيف بالأخضر الغامق، والمسار بالأزرق الغامق) */
    get promptParts(){
      if(this.location === "remote"){
        const path = "~" + (this.remoteCwdPath.length ? "/" + this.remoteCwdPath.join("/") : "");
        return { user: "webadmin@target", path, sym: "$" };
      }
      const path = "~" + (this.cwdPath.length ? "/" + this.cwdPath.join("/") : "");
      return this.mode === "kali"
        ? { user: "root@mansa15-lab", path, sym: "#" }
        : { user: "u0_a1@termux", path, sym: "$" };
    }

    promptHTML(){
      if(this.pendingInput){
        return `<span class="prompt">${escapeHtml(this.pendingInput.label)}</span>`;
      }
      const { user, path, sym } = this.promptParts;
      return `<span class="prompt"><span class="k-user">${escapeHtml(user)}</span><span class="k-sep">:</span><span class="k-path">${escapeHtml(path)}</span><span class="k-sym">${sym}</span></span>`;
    }

    printPromptLine(){
      const line = document.createElement("div");
      line.className = "line";
      line.innerHTML = `${this.promptHTML()} <span id="termCursor">_</span>`;
      this.out.appendChild(line);
      this.out.scrollTop = this.out.scrollHeight;
    }

    printRaw(text){
      const line = document.createElement("div");
      line.className = "line";
      line.textContent = text;
      const cursorLine = this.out.querySelector("#termCursor")?.closest(".line");
      if(cursorLine) this.out.insertBefore(line, cursorLine); else this.out.appendChild(line);
      this.out.scrollTop = this.out.scrollHeight;
    }

    printCmdEcho(cmd){
      const line = document.createElement("div");
      line.className = "line";
      line.innerHTML = `${this.promptHTML()} ${escapeHtml(cmd)}`;
      const cursorLine = this.out.querySelector("#termCursor")?.closest(".line");
      if(cursorLine) this.out.insertBefore(line, cursorLine); else this.out.appendChild(line);
    }

    navHistory(dir){
      if(!this.history.length) return;
      this.histIndex = Math.max(0, Math.min(this.history.length, this.histIndex + dir));
      this.input.value = this.history[this.histIndex] || "";
    }

    resolveDir(){
      let node = this.fs;
      for(const part of this.cwdPath){ node = node.children[part]; }
      return node;
    }
    resolveRemoteDir(){
      let node = this.remoteFS;
      for(const part of this.remoteCwdPath){ node = node.children[part]; }
      return node;
    }

    submit(){
      const raw = this.input.value;
      this.input.value = "";
      const cursorLine = this.out.querySelector("#termCursor")?.closest(".line");
      if(cursorLine) cursorLine.remove();

      if(this.pendingInput){
        const cb = this.pendingInput;
        this.pendingInput = null;
        this.input.type = "text";
        this.printCmdEchoRaw(cb.label, cb.mask ? "•".repeat(raw.length) : raw);
        cb.onSubmit(raw);
        this.printPromptLine();
        return;
      }

      const cmd = raw.trim();
      if(!cmd){ this.printPromptLine(); return; }
      this.history.push(cmd);
      this.histIndex = this.history.length;
      this.printCmdEcho(cmd);
      this.run(cmd);
      this.printPromptLine();
    }

    printCmdEchoRaw(label, text){
      const line = document.createElement("div");
      line.className = "line";
      line.innerHTML = `<span class="prompt">${label}</span> ${escapeHtml(text)}`;
      this.out.appendChild(line);
    }

    run(cmdline){
      const parts = cmdline.split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);
      const handler = this.commands[cmd];
      if(!handler){
        this.printRaw(`zsh: command not found: ${cmd}  (اكتب "help" لعرض الأوامر المتاحة)`);
        return;
      }
      try{ handler.call(this, args); }
      catch(e){ this.printRaw("خطأ داخلي في المحاكي: " + e.message); }
    }

    requireLocal(){
      if(this.location !== "local"){ this.printRaw("هذا الأمر متاح فقط على الجهاز المحلي — اكتب exit للعودة أولًا."); return false; }
      return true;
    }

    get commands(){
      const self = this;
      return {
        help(){
          const base = [
            "── أوامر عامة ──",
            "  ls [-la] [مسار]   pwd   cd <مسار>   cat <ملف>   mkdir/touch/rm <اسم>",
            "  grep <نص> <ملف>   find <اسم>   head/tail <ملف>   wc <ملف>",
            "  echo <نص> [> ملف] chmod <صلاحيات> <ملف>   whoami / id / uname -a / hostname / date",
            "  ps / top / df / free   env   history   clear   man <أمر>",
            "── الشبكة (محاكاة تعليمية فقط) ──",
            "  ifconfig   ping <هدف>   dig/nslookup <نطاق>   curl <رابط>",
            "── أدوات Kali (تحتاج apt install أولًا، ماعدا nmap) ──",
            "  apt install <أداة>   nmap <هدف>   nikto -h <هدف>   searchsploit <برنامج>",
            "  hydra -l <مستخدم> -P wordlist.txt ssh://<هدف>   john <ملف_هاش>",
            "── CTF ──",
            "  start   (تحدي محلي)      start2  (اختراق جهاز هدف)      ssh <مستخدم>@<هدف>      exit"
          ];
          self.printRaw(base.join("\n"));
        },
        start(){
          self.printRaw("🚩 المرحلة 1: افتح challenge.txt لقراءة التعليمات (cat challenge.txt).");
        },
        start2(){
          if(!self.flagFound){ self.printRaw("أنهِ المرحلة 1 أولًا (إيجاد العلم المحلي) قبل البدء بهذه المرحلة."); return; }
          self.stage2Started = true;
          self.printRaw([
            "🚩 المرحلة 2 — اختراق جهاز هدف تدريبي (10.13.37.10):",
            "1) امسح الهدف: nmap 10.13.37.10",
            "2) ثبّت أداة: apt install hydra",
            "3) جرّب اختراق كلمة مرور SSH: hydra -l webadmin -P wordlist.txt ssh://10.13.37.10",
            "4) اتصل: ssh webadmin@10.13.37.10",
            "5) داخل الجهاز: sudo -l  ثم استخدم الصلاحية التي تراها للوصول للعلم الثاني"
          ].join("\n"));
        },
        pwd(){ if(self.location==="remote"){ self.printRaw("/home/webadmin" + (self.remoteCwdPath.length?"/"+self.remoteCwdPath.join("/"):"")); return; } self.printRaw("/home/user" + (self.cwdPath.length ? "/" + self.cwdPath.join("/") : "")); },
        clear(){ self.out.innerHTML = ""; },
        history(){ self.printRaw(self.history.map((h,i)=>`  ${i+1}  ${h}`).join("\n") || "(لا يوجد سجل بعد)"); },
        whoami(){ self.printRaw(self.location === "remote" ? "webadmin" : "user"); },
        id(){ self.printRaw(self.location === "remote" ? "uid=1001(webadmin) gid=1001(webadmin) groups=1001(webadmin)" : "uid=1000(user) gid=1000(user) groups=1000(user),27(sudo)"); },
        hostname(){ self.printRaw(self.location === "remote" ? "target" : "mansa15-lab"); },
        date(){ self.printRaw(new Date().toString()); },
        env(){ self.printRaw("SHELL=/bin/bash\nUSER=" + (self.location==="remote"?"webadmin":"user") + "\nHOME=~\nLANG=ar_AR.UTF-8"); },
        ps(args){
          const aux = (args[0]==="aux");
          self.printRaw(aux
            ? "USER   PID  %CPU %MEM COMMAND\nuser     1   0.0  0.1  /sbin/init\nuser   842   0.2  0.5  bash\nuser  1190   0.0  0.3  mansa15-sim"
            : "  PID TTY          TIME CMD\n  842 pts/0    00:00:00 bash");
        },
        top(){ self.printRaw("(محاكاة top ثابتة)\nPID  USER  %CPU  COMMAND\n842  user  0.3   bash\n1190 user  0.1   mansa15-sim\n[اضغط q للخروج في نظام حقيقي]"); },
        df(){ self.printRaw("Filesystem  Size  Used  Avail  Use%  Mounted\n/dev/lab0    20G   4G    16G    20%   /"); },
        free(){ self.printRaw("              total   used   free\nMem:          2048    512    1536\nSwap:         1024      0    1024"); },
        man(args){
          const dict = {
            ls:"ls: يعرض محتويات مجلد.", cd:"cd: ينقلك بين المجلدات.",
            chmod:"chmod: يغيّر صلاحيات الوصول لملف (قراءة/كتابة/تنفيذ).", cat:"cat: يطبع محتوى ملف نصي.",
            grep:"grep: يبحث عن نص داخل ملف ويطبع الأسطر المطابقة.", nmap:"nmap: يفحص المنافذ المفتوحة على هدف (هنا: محاكاة تعليمية فقط).",
            hydra:"hydra: أداة تعليمية لشرح مفهوم تجربة كلمات مرور من قائمة (محاكاة، ليست تنفيذًا حقيقيًا).",
            ssh:"ssh: يفتح جلسة طرفية على جهاز آخر (هنا: الجهاز التدريبي فقط)."
          };
          self.printRaw(dict[args[0]] || `لا يوجد دليل لـ ${args[0] || ""}`);
        },
        neofetch(){
          self.printRaw(["      /\\      user@mansa15-lab","     /  \\     ---------------","    / /\\ \\    OS: Mansa15 Edu Linux (simulated)","   / ____ \\   Mode: " + self.mode,"  /_/    \\_\\  Shell: mansa15-sim"].join("\n"));
        },
        "uname"(args){
          if(args[0] === "-a") self.printRaw(`Linux ${self.location==="remote"?"target":"mansa15-lab"} 6.6.0-${self.mode}-edu #1 SMP PREEMPT x86_64 GNU/Linux (بيئة تعليمية محاكاة)`);
          else self.printRaw("Linux");
        },
        ifconfig(){
          if(!self.requireLocal()) return;
          self.printRaw(["lo:    inet 127.0.0.1  (loopback)","lab0:  inet 10.13.37.2  netmask 255.255.255.0  (شبكة المختبر المعزولة فقط — لا اتصال بالإنترنت الحقيقي)"].join("\n"));
        },
        ping(args){
          if(!self.requireLocal()) return;
          const t = args[0];
          if(t !== "10.13.37.10" && t !== "127.0.0.1"){ self.printRaw("ping: هذا المحاكي يسمح فقط بمحاكاة ping داخل شبكة المختبر (10.13.37.10) — لا يوجد اتصال إنترنت حقيقي."); return; }
          self.printRaw(`PING ${t}: 4 packets transmitted, 4 received, 0% packet loss (محاكاة)`);
        },
        dig(args){ self.dnsLookup(args[0]); },
        nslookup(args){ self.dnsLookup(args[0]); },
        whois(args){ self.printRaw(`whois: هذا محاكي تعليمي بلا اتصال إنترنت حقيقي. جرّب dig ${args[0]||'lab.mansa15.local'} بدلًا من ذلك.`); },
        curl(args){
          if(!self.requireLocal()) return;
          const url = args[0] || "";
          if(!url.includes("lab.mansa15.local") && !url.includes("10.13.37.10")){ self.printRaw("curl: (محاكاة) هذا المحاكي معزول تمامًا عن الإنترنت الحقيقي — يمكنه فقط \"الوصول\" لعناوين المختبر الوهمية مثل http://lab.mansa15.local"); return; }
          self.printRaw("<html><body><h1>Mansa15 Training Lab</h1><p>صفحة ويب وهمية لأغراض التدريب فقط.</p></body></html>");
        },
        wget(args){ self.commands.curl.call(self, args); },
        grep(args){
          const [needle, path] = args;
          const node = self.location === "remote" ? self.remoteLookup(path) : self.lookup(path);
          if(!node || node.type !== "file"){ self.printRaw(`grep: ${path}: لا يوجد ملف بهذا الاسم`); return; }
          const lines = (node.content||"").split("\n").filter(l => l.includes(needle));
          self.printRaw(lines.join("\n") || "(لا نتائج)");
        },
        find(args){
          const name = args[0];
          const results = [];
          const walk = (node, path) => {
            if(!node.children) return;
            for(const [n, child] of Object.entries(node.children)){
              const full = path + "/" + n;
              if(!name || n.includes(name)) results.push(full);
              if(child.type === "dir") walk(child, full);
            }
          };
          walk(self.location==="remote" ? self.remoteFS : self.fs, ".");
          self.printRaw(results.join("\n") || "(لا نتائج)");
        },
        head(args){ self.headTail(args, "head"); },
        tail(args){ self.headTail(args, "tail"); },
        wc(args){
          const node = self.location === "remote" ? self.remoteLookup(args[0]) : self.lookup(args[0]);
          if(!node || node.type !== "file"){ self.printRaw(`wc: ${args[0]}: لا يوجد ملف بهذا الاسم`); return; }
          const lines = (node.content||"").split("\n");
          self.printRaw(`${lines.length} ${lines.join(" ").split(/\s+/).filter(Boolean).length} ${(node.content||"").length} ${args[0]}`);
        },
        echo(args){
          const joined = args.join(" ");
          const redirectIdx = args.findIndex(a => a === ">" || a === ">>");
          if(redirectIdx === -1){ self.printRaw(joined); return; }
          const text = args.slice(0, redirectIdx).join(" ");
          const filename = args[redirectIdx+1];
          if(!filename){ self.printRaw("echo: اسم ملف مفقود بعد إشارة التحويل"); return; }
          const dir = self.resolveDir();
          const append = args[redirectIdx] === ">>";
          const existing = dir.children[filename];
          dir.children[filename] = { type:"file", perms:"644", owner:"user", content: append && existing ? (existing.content + "\n" + text) : text };
        },
        ls(args){
          const flags = args.filter(a=>a.startsWith("-")).join("");
          const pathArg = args.find(a=>!a.startsWith("-"));
          let node = self.location === "remote" ? self.resolveRemoteDir() : self.resolveDir();
          if(pathArg){
            const target = self.location === "remote" ? self.remoteLookup(pathArg) : self.lookup(pathArg);
            if(!target){ self.printRaw(`ls: لا يمكن الوصول إلى '${pathArg}': لا يوجد ملف أو مجلد بهذا الاسم`); return; }
            node = target.type === "dir" ? target : node;
          }
          const entries = Object.entries(node.children || {});
          if(!entries.length){ self.printRaw(""); return; }
          if(flags.includes("l")){
            self.printRaw(entries.map(([name,n])=>{
              const perm = self.permString(n.perms, n.type);
              return `${perm} ${n.owner.padEnd(8)} ${(n.type==="dir"?"4096":String((n.content||"").length)).padStart(6)} ${name}${n.type==="dir"?"/":""}`;
            }).join("\n"));
          } else {
            self.printRaw(entries.map(([name,n])=> name + (n.type==="dir"?"/":"")).join("  "));
          }
        },
        cd(args){
          const target = args[0];
          const path = self.location === "remote" ? self.remoteCwdPath : self.cwdPath;
          const dir = self.location === "remote" ? self.resolveRemoteDir() : self.resolveDir();
          if(!target || target === "~"){ path.length = 0; return; }
          if(target === ".."){ path.pop(); return; }
          const next = dir.children[target];
          if(!next){ self.printRaw(`cd: ${target}: لا يوجد مجلد بهذا الاسم`); return; }
          if(next.type !== "dir"){ self.printRaw(`cd: ${target}: ليس مجلدًا`); return; }
          path.push(target);
        },
        mkdir(args){ if(!self.requireLocal()) return; if(!args[0]){ self.printRaw("الاستخدام: mkdir <اسم>"); return; } self.resolveDir().children[args[0]] = { type:"dir", perms:"755", owner:"user", children:{} }; },
        touch(args){ if(!self.requireLocal()) return; if(!args[0]){ self.printRaw("الاستخدام: touch <اسم>"); return; } const d=self.resolveDir(); d.children[args[0]] = d.children[args[0]] || { type:"file", perms:"644", owner:"user", content:"" }; },
        rm(args){ if(!self.requireLocal()) return; if(!args[0]){ self.printRaw("الاستخدام: rm <اسم>"); return; } delete self.resolveDir().children[args[0]]; },
        cat(args){
          const path = args[0];
          if(!path){ self.printRaw("الاستخدام: cat <ملف>"); return; }
          const node = self.location === "remote" ? self.remoteLookup(path) : self.lookup(path);
          if(!node){ self.printRaw(`cat: ${path}: لا يوجد ملف بهذا الاسم`); return; }
          if(node.type === "dir"){ self.printRaw(`cat: ${path}: هذا مجلد وليس ملفًا`); return; }
          if(node.owner === "root" && !["644","664","666"].includes(node.perms)){
            self.printRaw(`cat: ${path}: Permission denied (الملف مملوك لـ root وصلاحياته ${node.perms} — جرّب تغييرها بـ chmod)`);
            return;
          }
          self.printRaw(node.content || "(ملف فارغ)");
          if(self.location === "local" && node.content && node.content.startsWith("flag{") && !self.flagFound){
            self.flagFound = true;
            self.printRaw("🎉 أحسنت! وجدت العلم الأول. اكتب start2 للمرحلة التالية.");
            self.awardBadge("🔓");
          }
        },
        chmod(args){
          if(!self.requireLocal()) return;
          const [perm, path] = args;
          if(!perm || !path){ self.printRaw("الاستخدام: chmod <صلاحيات> <ملف>"); return; }
          const node = self.lookup(path);
          if(!node){ self.printRaw(`chmod: ${path}: لا يوجد ملف بهذا الاسم`); return; }
          if(!/^[0-7]{3}$/.test(perm)){ self.printRaw("chmod: استخدم صيغة رقمية مثل 644 أو 755"); return; }
          node.perms = perm;
          self.printRaw(`تم تغيير صلاحيات ${path} إلى ${perm}`);
        },
        apt(args){
          if(self.mode !== "kali"){ self.printRaw("apt: أدوات الاختراق غير متاحة في وضع Termux — بدّل لوضع Kali."); return; }
          if(args[0] !== "install" || !args[1]){ self.printRaw("الاستخدام: apt install <اسم_الأداة>"); return; }
          const tool = args[1];
          if(!KNOWN_TOOLS.includes(tool) && tool !== "nmap"){ self.printRaw(`E: Unable to locate package ${tool}`); return; }
          self.installed.add(tool);
          self.printRaw([`Reading package lists... Done`,`Building dependency tree... Done`,`تثبيت ${tool} (محاكاة تعليمية)...`,`تم ✅ — الأداة "${tool}" متاحة الآن.`].join("\n"));
        },
        nmap(args){
          const target = args[args.length-1];
          if(!target){ self.printRaw("الاستخدام: nmap <هدف>  — جرّب: nmap 10.13.37.10"); return; }
          if(target !== "10.13.37.10"){ self.printRaw("هذا محاكي تعليمي فقط ولا يقوم بأي فحص شبكي حقيقي. الهدف التدريبي الوحيد المتاح هو 10.13.37.10 داخل المختبر المعزول."); return; }
          self.printRaw(["Starting Nmap (simulated educational scan) against 10.13.37.10","PORT     STATE  SERVICE","22/tcp   open   ssh (تدريبي)","80/tcp   open   http (تدريبي)","Nmap done — ناتج تعليمي ثابت لشرح قراءة تقرير nmap، وليس فحصًا حقيقيًا."].join("\n"));
        },
        nikto(args){
          if(!self.installed.has("nikto")){ self.printRaw("nikto: command not found — جرّب: apt install nikto"); return; }
          self.printRaw(["- Nikto v2.5 (محاكاة تعليمية)","+ Target: 10.13.37.10","+ Server may leak inodes via ETags (مثال تعليمي شائع)","+ /admin/: قد يحتاج مراجعة صلاحيات الوصول","-------------------------------------","هذا ناتج ثابت لأغراض تعلّم قراءة تقارير فحص الثغرات، وليس فحصًا حقيقيًا."].join("\n"));
        },
        searchsploit(args){
          if(!self.installed.has("searchsploit")){ self.printRaw("searchsploit: command not found — جرّب: apt install searchsploit"); return; }
          self.printRaw(`(محاكاة) لا نتائج ثغرات حرجة معروفة لـ "${args.join(' ')}" — هذا مثال تعليمي لشرح فكرة البحث عن ثغرات معروفة (CVE) قبل أي اختبار اختراق حقيقي ومُصرَّح به.`);
        },
        john(args){
          if(!self.installed.has("john")){ self.printRaw("john: command not found — جرّب: apt install john"); return; }
          self.printRaw(["Loaded 1 password hash (محاكاة)","Cracking...","Summer2024!    (webadmin)  [مثال تعليمي ثابت لشرح مفهوم كسر كلمات المرور الضعيفة]"].join("\n"));
        },
        hydra(args){
          if(!self.installed.has("hydra")){ self.printRaw("hydra: command not found — جرّب: apt install hydra"); return; }
          if(!args.join(" ").includes("10.13.37.10")){ self.printRaw("hydra: هذا المحاكي يدعم فقط الهدف التدريبي 10.13.37.10"); return; }
          self.hydraCredsFound = true;
          self.printRaw(["Hydra starting (محاكاة تعليمية)...","[22][ssh] host: 10.13.37.10   login: webadmin   password: Summer2024!","1 valid password found — درس: كلمات المرور الضعيفة من القوائم الشائعة سهلة الاختراق، استخدم دائمًا كلمات مرور قوية وفريدة."].join("\n"));
        },
        ssh(args){
          if(!self.requireLocal()) return;
          const target = args[0] || "";
          const m = target.match(/^([\w.]+)@([\d.]+)$/);
          if(!m){ self.printRaw("الاستخدام: ssh <مستخدم>@<هدف>"); return; }
          const [, user, host] = m;
          if(host !== "10.13.37.10"){ self.printRaw("ssh: هذا المحاكي يسمح فقط بالاتصال بجهاز المختبر التدريبي 10.13.37.10"); return; }
          if(user !== "webadmin"){ self.printRaw(`ssh: ${user}@${host}: Permission denied`); return; }
          self.pendingInput = {
            label: `Password for webadmin@10.13.37.10:`,
            mask: true,
            onSubmit(pw){
              if(pw === "Summer2024!"){
                self.location = "remote";
                self.remoteCwdPath = [];
                self.printRaw("✅ تم الاتصال بنجاح بالجهاز التدريبي.");
                self.printRaw("مرحبًا بك webadmin@target — اكتب ls للبدء، أو sudo -l لمعرفة صلاحياتك.");
              } else {
                self.printRaw("Permission denied, please try again. (تلميح: استخدم hydra أولًا لإيجاد كلمة المرور الصحيحة)");
              }
            }
          };
          self.input.type = "password";
        },
        exit(){
          if(self.location === "remote"){ self.location = "local"; self.printRaw("تم قطع الاتصال بالجهاز التدريبي. عدت للجهاز المحلي."); }
          else self.printRaw("لا يوجد اتصال نشط لإنهائه.");
        },
        "sudo"(args){
          if(self.location !== "remote"){ self.printRaw("sudo: على الجهاز المحلي أنت مستخدم بلا صلاحيات جذر في هذا المختبر — جرّب استكشاف الأوامر الأخرى."); return; }
          if(args[0] === "-l"){
            self.printRaw("Matching Defaults entries for webadmin on target:\nUser webadmin may run the following commands:\n    (root) NOPASSWD: /usr/bin/cat /root/flag2.txt\n\n(مثال تعليمي شائع: صلاحية sudo واسعة جدًا لأمر واحد — درس في تصعيد الصلاحيات)");
            return;
          }
          if(args[0] === "cat" && args[1] === "/root/flag2.txt"){
            self.printRaw("flag{privilege_escalation_101_mansa15}");
            self.printRaw("🎉🎉 أحسنت! أكملت مسار CTF كاملًا (استطلاع → كسر كلمة مرور → دخول → تصعيد صلاحيات).");
            self.awardBadge("🚩");
            return;
          }
          self.printRaw("sudo: هذا الأمر غير مسموح لك (Command not allowed via sudoers)");
        }
      };
    }

    dnsLookup(domain){
      if(!this.requireLocal()) return;
      if(domain !== "lab.mansa15.local"){ this.printRaw(`لا توجد سجلات DNS حقيقية هنا — هذا محاكي معزول. جرّب: dig lab.mansa15.local`); return; }
      this.printRaw("lab.mansa15.local.  3600  IN  A  10.13.37.10   (نطاق وهمي داخل المختبر فقط)");
    }

    headTail(args, kind){
      const path = args[args.length-1];
      const node = this.location === "remote" ? this.remoteLookup(path) : this.lookup(path);
      if(!node || node.type !== "file"){ this.printRaw(`${kind}: ${path}: لا يوجد ملف بهذا الاسم`); return; }
      const lines = (node.content||"").split("\n");
      this.printRaw((kind === "head" ? lines.slice(0,5) : lines.slice(-5)).join("\n"));
    }

    permString(perms, type){
      const map = { "7":"rwx","6":"rw-","5":"r-x","4":"r--","0":"---","1":"--x","2":"-w-","3":"-wx" };
      return (type==="dir"?"d":"-") + perms.split("").map(d=>map[d]||"---").join("");
    }

    lookup(path){
      const parts = path.replace(/^\.\//,"").split("/").filter(Boolean);
      let node = this.resolveDir();
      for(const part of parts){
        if(!node || !node.children || !node.children[part]) return null;
        node = node.children[part];
      }
      return node;
    }
    remoteLookup(path){
      const parts = (path||"").replace(/^\.\//,"").split("/").filter(Boolean);
      let node = this.resolveRemoteDir();
      for(const part of parts){
        if(!node || !node.children || !node.children[part]) return null;
        node = node.children[part];
      }
      return node;
    }

    awardBadge(emoji){
      try{
        if(typeof STATE !== "undefined" && !STATE.user.badges.includes(emoji)){
          STATE.user.badges.push(emoji);
          if(typeof saveState === "function") saveState(STATE);
        }
      }catch(e){ /* لا تكسر المحاكي لو تعذّر الحفظ */ }
    }
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  }

  window.TerminalSim = TerminalSim;
})();
