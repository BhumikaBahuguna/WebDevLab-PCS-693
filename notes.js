const {
  Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,
  Header,Footer,AlignmentType,HeadingLevel,BorderStyle,WidthType,
  ShadingType,PageNumber,PageBreak,LevelFormat,TabStopType,TabStopPosition
} = require('docx');
const fs = require('fs');

const C={
  navy:"0D2137",red:"B71C1C",blue:"0D47A1",teal:"004D40",
  white:"FFFFFF",gray:"F5F5F5",yellow:"FFFDE7",green:"E8F5E9",
  lightBlue:"E3F2FD",pink:"FFEBEE",orange:"FFF3E0",purple:"F3E5F5",
  darkTeal:"00695C",gold:"E65100",midBlue:"1565C0",lightGreen:"1B5E20",
};
const b1=(c="999")=>({style:BorderStyle.SINGLE,size:4,color:c});
const cb=(c="BBB")=>({top:b1(c),bottom:b1(c),left:b1(c),right:b1(c)});
const sp=(a=0,b=90)=>({before:a,after:b});
const pb=()=>new Paragraph({children:[new PageBreak()]});
const el=(n=1)=>Array.from({length:n},()=>new Paragraph({spacing:sp(0,0),children:[new TextRun("")]}));
const div=()=>new Paragraph({spacing:sp(80,80),border:{bottom:{style:BorderStyle.SINGLE,size:8,color:C.blue,space:1}},children:[new TextRun("")]});
const h1=t=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:sp(340,180),shading:{fill:C.navy,type:ShadingType.CLEAR},children:[new TextRun({text:t,color:C.white,bold:true,size:34,font:"Arial"})]});
const h2=t=>new Paragraph({heading:HeadingLevel.HEADING_2,spacing:sp(240,130),shading:{fill:C.blue,type:ShadingType.CLEAR},children:[new TextRun({text:t,color:C.white,bold:true,size:26,font:"Arial"})]});
const h3=t=>new Paragraph({heading:HeadingLevel.HEADING_3,spacing:sp(180,100),shading:{fill:C.lightBlue,type:ShadingType.CLEAR},children:[new TextRun({text:t,color:C.navy,bold:true,size:22,font:"Arial"})]});
const body=(t,opts={})=>new Paragraph({spacing:sp(50,80),children:[new TextRun({text:t,size:21,font:"Arial",...opts})]});
const bul=(t,lv=0)=>new Paragraph({numbering:{reference:"bull",level:lv},spacing:sp(35,65),children:[new TextRun({text:t,size:21,font:"Arial"})]});
const nm=(t,lv=0)=>new Paragraph({numbering:{reference:"nums",level:lv},spacing:sp(35,65),children:[new TextRun({text:t,size:21,font:"Arial"})]});
const cd=t=>new Paragraph({spacing:sp(35,35),shading:{fill:"EEEEEE",type:ShadingType.CLEAR},indent:{left:280},children:[new TextRun({text:t,font:"Courier New",size:19,color:"1A1A1A"})]});
const tip=t=>new Paragraph({spacing:sp(65,65),shading:{fill:C.yellow,type:ShadingType.CLEAR},indent:{left:300,right:300},children:[new TextRun({text:"💡 TIP: ",bold:true,size:21,font:"Arial",color:C.gold}),new TextRun({text:t,size:21,font:"Arial",color:C.gold})]});
const trap=t=>new Paragraph({spacing:sp(65,65),shading:{fill:C.pink,type:ShadingType.CLEAR},indent:{left:300,right:300},children:[new TextRun({text:"⚠️ MCQ TRAP: ",bold:true,size:21,font:"Arial",color:C.red}),new TextRun({text:t,size:21,font:"Arial",color:C.red})]});
const key=t=>new Paragraph({spacing:sp(65,65),shading:{fill:C.green,type:ShadingType.CLEAR},indent:{left:300,right:300},children:[new TextRun({text:"🔑 KEY: ",bold:true,size:21,font:"Arial",color:C.lightGreen}),new TextRun({text:t,size:21,font:"Arial",color:C.lightGreen})]});
const def=(term,txt)=>new Paragraph({spacing:sp(65,65),shading:{fill:"E0F7FA",type:ShadingType.CLEAR},indent:{left:300,right:300},children:[new TextRun({text:term+": ",bold:true,size:21,font:"Arial",color:C.teal}),new TextRun({text:txt,size:21,font:"Arial",italics:true})]});
const ascii=lines=>new Paragraph({spacing:sp(65,65),shading:{fill:C.gray,type:ShadingType.CLEAR},indent:{left:300},children:lines.flatMap((l,i)=>[new TextRun({text:l,font:"Courier New",size:18,break:i>0?1:0})])});
function tbl(headers,rows,widths){
  const hr=new TableRow({children:headers.map((h,i)=>new TableCell({borders:cb(C.midBlue),width:{size:widths[i],type:WidthType.DXA},shading:{fill:C.blue,type:ShadingType.CLEAR},margins:{top:70,bottom:70,left:100,right:100},children:[new Paragraph({children:[new TextRun({text:h,bold:true,color:C.white,size:19,font:"Arial"})]})]}))});
  const dr=rows.map((row,ri)=>new TableRow({children:row.map((cell,ci)=>new TableCell({borders:cb("CCCCCC"),width:{size:widths[ci],type:WidthType.DXA},shading:{fill:ri%2===0?C.white:C.gray,type:ShadingType.CLEAR},margins:{top:65,bottom:65,left:100,right:100},children:[new Paragraph({children:[new TextRun({text:cell,size:19,font:"Arial"})]})]}))}) );
  return new Table({width:{size:widths.reduce((a,b)=>a+b,0),type:WidthType.DXA},columnWidths:widths,rows:[hr,...dr]});
}
const secHdr=(title,sub)=>[pb(),
  new Paragraph({spacing:sp(0,50),alignment:AlignmentType.CENTER,shading:{fill:C.navy,type:ShadingType.CLEAR},children:[new TextRun({text:title,bold:true,size:40,color:C.white,font:"Arial"})]}),
  new Paragraph({spacing:sp(0,260),alignment:AlignmentType.CENTER,shading:{fill:C.navy,type:ShadingType.CLEAR},children:[new TextRun({text:sub,size:22,color:"AACCFF",font:"Arial",italics:true})]}),
];

// MCQ system — inline answer
let qn=0;
const Q=(question,opts,ans,expl)=>{
  qn++;
  return [
    new Paragraph({spacing:sp(90,50),children:[
      new TextRun({text:`Q${qn}. `,bold:true,size:21,font:"Arial",color:C.navy}),
      new TextRun({text:question,bold:true,size:21,font:"Arial"}),
    ]}),
    ...opts.map(o=>new Paragraph({spacing:sp(18,18),indent:{left:340},children:[new TextRun({text:o,size:20,font:"Arial",color:o.startsWith(ans.charAt(0))?"000000":"333333"})]})),
    new Paragraph({spacing:sp(35,25),shading:{fill:C.green,type:ShadingType.CLEAR},indent:{left:340,right:340},children:[
      new TextRun({text:`✅ ${ans}  `,bold:true,size:19,font:"Arial",color:C.lightGreen}),
      new TextRun({text:"| "+expl,size:19,font:"Arial",color:"2E7D32"}),
    ]}),
    ...el(),
  ];
};

// ═══════════════════════════════════════
function build(){
const P=[];

// TITLE
P.push(
  ...el(4),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(0,100),children:[new TextRun({text:"SAMSUNG ELECTRO-MECHANICS",bold:true,size:52,font:"Arial",color:C.navy})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(0,80),children:[new TextRun({text:"C# + React Intern — OA COMPLETE PREP KIT",bold:true,size:36,font:"Arial",color:C.red})]}),
  div(),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(80,50),children:[new TextRun({text:"Core CS  •  C# & ASP.NET Core  •  React  •  SQL  •  OOP",size:26,font:"Arial",color:"333333"})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(0,50),children:[new TextRun({text:"115 MCQs with instant answers  •  Revision Notes  •  Cheat Sheet  •  Predicted Questions",size:22,font:"Arial",color:"555555",italics:true})]}),
  ...el(2),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(0,60),children:[new TextRun({text:"⏱ 1-Day Prep  |  Easy–Medium Level  |  1-Hour OA Format",size:22,font:"Arial",color:C.blue})]}),
  pb()
);

// STEP 1: PRIORITY MAP
P.push(
  h1("STEP 1 — TOPIC PRIORITY MAP"),
  body("High-probability topics based on Samsung EM C# + React Intern JD:"),
  ...el(),
  tbl(["Priority","Topic","Key Sub-Topics","Expected MCQs"],
    [["🔴 HIGH","OOP + C#","Polymorphism, abstract/sealed/virtual, override vs overload, ref/out, const vs readonly","10–12"],
     ["🔴 HIGH","React","useState, useEffect, Virtual DOM, props vs state, keys, hooks","8–10"],
     ["🔴 HIGH","SQL","Joins, GROUP BY/HAVING, NULL traps, Aggregates, Subqueries","8–10"],
     ["🟡 MED","OS","Scheduling (starvation, algorithms), Deadlocks, Paging, Threads","6–8"],
     ["🟡 MED","DBMS","Normalization 1NF–BCNF, ACID, Keys, Indexes","5–7"],
     ["🟡 MED","ASP.NET Core","MVC, Middleware, REST methods, Status codes, DI lifetimes","5–7"],
     ["🟢 LOW","DSA","Big-O, Trees, Hashing, Sorting comparison","3–5"],
     ["🟢 LOW","Networks","HTTP/HTTPS, TCP/UDP, DNS basics","2–3"]],
    [1000,1800,5000,1560]),
  pb()
);

// STEP 2: NOTES
P.push(...secHdr("STEP 2 — CONCISE REVISION NOTES","Scan these before attempting MCQs — focus on highlighted traps"));

// OS NOTES
P.push(
  h1("OS NOTES"),
  h2("CPU Scheduling — Key Facts"),
  tbl(["Algorithm","Preemptive?","Starvation?","Special Trait"],
    [["FCFS","No","No","Convoy effect: short jobs wait behind long ones"],
     ["SJF","No","YES","Optimal avg waiting time; needs burst time in advance"],
     ["SRTF","Yes","YES","= Preemptive SJF; best avg waiting time"],
     ["Round Robin","Yes","No","Fair; quantum size critical (too small=overhead, too large=FCFS)"],
     ["Priority","Both","YES","Low-priority starves; fix: AGING (gradually increase priority)"],
     ["MLFQ","Yes","No (aging)","Adaptive; used in real OSes; most practical"]],
    [2200,1600,1400,4160]),
  ...el(),
  key("STARVATION occurs in SJF, SRTF, Priority. SOLUTION = AGING. FCFS has no starvation but has CONVOY EFFECT."),
  trap("SRTF is the preemptive version of SJF — they are the SAME algorithm. Don't confuse them as different."),
  ...el(),
  h2("Deadlocks"),
  body("All 4 Coffman conditions must hold simultaneously:"),
  bul("Mutual Exclusion — resource held by only ONE process"),
  bul("Hold & Wait — holds one resource, waiting for more"),
  bul("No Preemption — resource cannot be forcibly taken"),
  bul("Circular Wait — cycle: P1→P2→...→Pn→P1"),
  ...el(),
  tbl(["Strategy","What It Does","Example"],
    [["Prevention","Eliminate ≥1 of the 4 conditions","Allow preemption; deny hold & wait"],
     ["Avoidance","Check safe state before granting (Banker's Algo)","OS asks: 'will granting leave system safe?'"],
     ["Detection + Recovery","Allow deadlock; detect via resource graph; recover by killing process","Unix uses this"],
     ["Ignore (Ostrich)","Pretend it doesn't happen; reboot if needed","Windows, Linux desktop"]],
    [2000,3600,3760]),
  key("Banker's Algorithm = Deadlock AVOIDANCE (not prevention). Checks safe state before resource grant."),
  ...el(),
  h2("Memory Management"),
  tbl(["Concept","Key Fact"],
    [["Paging","Fixed-size pages + frames. No EXTERNAL fragmentation. Has INTERNAL fragmentation (last page)."],
     ["Segmentation","Variable-size segments. Has EXTERNAL fragmentation. No INTERNAL fragmentation."],
     ["TLB","Hardware cache for page table entries — makes address translation O(1) not O(n)"],
     ["Page Fault","Page not in RAM → OS loads from disk. Increases access time significantly."],
     ["Belady's Anomaly","FIFO page replacement only — more frames can INCREASE faults. LRU and OPT unaffected."],
     ["Thrashing","Too many processes + too little RAM → more time paging than executing → CPU util drops"]],
    [2400,6960]),
  ...el(),
  h2("Process vs Thread"),
  tbl(["Aspect","Process","Thread"],
    [["Memory","Own address space","Shares process address space"],
     ["Creation cost","Heavy (fork + copy)","Light (just stack + registers)"],
     ["Communication","IPC: pipes, sockets, shared mem","Direct shared memory (need sync)"],
     ["Failure isolation","Crash stays in process","One crash can kill all threads"],
     ["Context switch","Slow (full address space change)","Fast (registers only)"]],
    [2600,3380,3380]),
  pb()
);

// DBMS NOTES
P.push(
  h1("DBMS NOTES"),
  h2("Normalization — Most-Tested"),
  tbl(["Form","Removes","Memory Trick"],
    [["1NF","Non-atomic values, repeating groups","'1 value per cell'"],
     ["2NF","Partial dependency (non-key depends on PART of composite PK)","'2NF = full PK dependency'"],
     ["3NF","Transitive dependency (non-key → non-key)","'3NF = no non-key chains'"],
     ["BCNF","All remaining FD anomalies (every determinant must be superkey)","'BCNF = only superkeys determine'"]],
    [1800,4000,3560]),
  trap("3NF removes TRANSITIVE dependency. 2NF removes PARTIAL dependency. This distinction is asked in EVERY exam."),
  ...el(),
  h2("Keys"),
  tbl(["Key","Unique?","NULL allowed?","Count per table"],
    [["Primary Key","Yes","NO","Exactly 1"],
     ["Unique Key","Yes","YES (one null)","Multiple allowed"],
     ["Foreign Key","No (duplicates OK)","YES","Multiple allowed"],
     ["Candidate Key","Yes","NO","≥1 (could be PK)"],
     ["Composite Key","Together unique","NO","1 (as PK)"]],
    [2500,1800,2000,2060]),
  ...el(),
  h2("ACID"),
  tbl(["Property","One-line meaning"],
    [["Atomicity","All or nothing — partial execution never committed"],
     ["Consistency","Transaction brings DB from valid state to another valid state"],
     ["Isolation","Concurrent transactions don't see each other's intermediate state"],
     ["Durability","Once committed, data survives crashes (write-ahead log)"]],
    [2500,6860]),
  pb()
);

// OOP NOTES
P.push(
  h1("OOP NOTES"),
  h2("4 Pillars"),
  tbl(["Pillar","One-line","C# Example"],
    [["Encapsulation","Bundle data+methods; hide with private","private int _balance; public int GetBalance() => _balance;"],
     ["Abstraction","Show WHAT, hide HOW","abstract class Shape { public abstract void Draw(); }"],
     ["Inheritance","IS-A: child inherits parent","class Dog : Animal { }"],
     ["Polymorphism","Same interface, many forms","Animal a = new Dog(); a.Speak(); // calls Dog's Speak"]],
    [2200,3400,3760]),
  ...el(),
  h2("Overloading vs Overriding — MOST TESTED"),
  tbl(["Aspect","Overloading","Overriding"],
    [["Where","Same class","Parent + Child class"],
     ["Signature","Different parameters","SAME signature"],
     ["Resolution","Compile-time (static binding)","Runtime (dynamic binding)"],
     ["C# keyword","None needed","override keyword required"],
     ["Return type","Can differ","Must be same or covariant"],
     ["static methods","Can be overloaded","Cannot be overridden (use 'new' to hide)"]],
    [2400,3480,3480]),
  trap("static methods CANNOT be overridden — only HIDDEN with 'new' keyword. This is method HIDING, not overriding."),
  ...el(),
  h2("Abstract Class vs Interface"),
  tbl(["Aspect","Abstract Class","Interface"],
    [["Instance?","No (cannot new it)","No"],
     ["Methods","Concrete + abstract both","All abstract (C#8+ allows default)"],
     ["Constructor","YES","NO"],
     ["Instance fields","YES","NO (only constants)"],
     ["Multiple inherit","NO","YES (implement many)"],
     ["Access modifiers","Any","Public by default"],
     ["Use when","Shared code for RELATED classes","Capability/contract for ANY class"]],
    [2600,3380,3380]),
  pb()
);

// C# NOTES
P.push(
  h1("C# NOTES"),
  h2("Critical Keywords"),
  tbl(["Keyword","Meaning","Trap to Know"],
    [["sealed","Cannot be INHERITED","sealed can be instantiated; abstract cannot"],
     ["abstract","Cannot be INSTANTIATED","abstract class CAN have concrete methods"],
     ["virtual","CAN be overridden (optional)","If not overridden, base version runs"],
     ["override","Redefines virtual/abstract method","Must mark base method virtual/abstract first"],
     ["new (method)","HIDES parent method (not true override)","Hiding ≠ Overriding; base reference calls base method"],
     ["const","Compile-time constant; static implicitly","Cannot be changed; must init at declaration"],
     ["readonly","Set once: at declaration or in constructor","Can be instance-specific; evaluated at runtime"],
     ["static","Belongs to class, not instance","static class cannot be instantiated OR inherited"]],
    [2000,3200,4160]),
  ...el(),
  h2("Value Types vs Reference Types"),
  tbl(["Category","Types","Copy Behavior","Default Value"],
    [["Value Type","int, float, bool, char, struct, enum","Copies the VALUE","0 / false / '\\0'"],
     ["Reference Type","class, string, array, interface, delegate","Copies the REFERENCE (pointer)","null"]],
    [2200,3000,2400,1760]),
  trap("string is a reference type BUT it behaves like a value type due to IMMUTABILITY. string a = b; a = 'new' creates a new string — doesn't change b."),
  ...el(),
  h2("ref vs out vs params"),
  cd("// ref: must initialize before; method can read+write"),
  cd("void Add(ref int x) { x += 10; }   int n = 5; Add(ref n); // n=15"),
  cd(""),
  cd("// out: must assign inside method; caller doesn't need to init"),
  cd("void GetVal(out int x) { x = 42; }  int n; GetVal(out n); // n=42"),
  cd(""),
  cd("// params: variable number of arguments"),
  cd("void Print(params int[] nums) { }   Print(1,2,3,4,5);"),
  ...el(),
  h2("Nullable & Null Operators"),
  cd("int? x = null;           // Nullable value type"),
  cd("int y = x ?? 10;         // ?? : return 10 if x is null"),
  cd("int? z = obj?.Length;    // ?. : null if obj is null, else .Length"),
  cd("string s = obj as string; // as: null if cast fails (no exception)"),
  cd("bool b = obj is string;  // is: returns bool"),
  ...el(),
  h2("DI Lifetimes in ASP.NET Core"),
  tbl(["Lifetime","Created When","Example Use"],
    [["Singleton","Once for app lifetime","Logger, Configuration"],
     ["Scoped","Once per HTTP request","DbContext, Unit of Work"],
     ["Transient","Every time requested","Lightweight, stateless services"]],
    [2500,3500,3360]),
  ...el(),
  h2("async/await"),
  bul("async method must return Task, Task<T>, or void (events only)"),
  bul("await suspends current method, DOES NOT block the thread"),
  bul("async void = fire-and-forget; cannot be awaited; exceptions lost"),
  bul("ConfigureAwait(false) = don't capture sync context (library code)"),
  pb()
);

// REST + ASP.NET NOTES
P.push(
  h1("ASP.NET CORE + REST NOTES"),
  h2("HTTP Methods"),
  tbl(["Method","Purpose","Idempotent?","Body?"],
    [["GET","Retrieve data","YES","No"],
     ["POST","Create new resource","NO","Yes"],
     ["PUT","Full replace (update)","YES","Yes"],
     ["PATCH","Partial update","NO","Yes"],
     ["DELETE","Remove resource","YES","No"]],
    [1800,2800,1900,1860]),
  trap("Idempotent = same request sent multiple times has same result. GET, PUT, DELETE are idempotent. POST and PATCH are NOT."),
  ...el(),
  h2("HTTP Status Codes"),
  tbl(["Code","Meaning","When"],
    [["200 OK","Success with body","GET, PUT success"],
     ["201 Created","Resource created","POST success"],
     ["204 No Content","Success no body","DELETE, PUT (no body)"],
     ["400 Bad Request","Client sent invalid data","Validation error"],
     ["401 Unauthorized","Not authenticated","No/invalid token"],
     ["403 Forbidden","Authenticated, no permission","Role check failed"],
     ["404 Not Found","Resource missing","Wrong ID"],
     ["409 Conflict","Duplicate resource","Email already exists"],
     ["500 Internal Server Error","Unhandled exception","Bug in server code"]],
    [1600,2800,4960]),
  trap("401 vs 403: 401 = WHO are you? (not logged in). 403 = I know who you are, but NO. Very common MCQ."),
  ...el(),
  h2("Middleware Pipeline Order"),
  cd("app.UseExceptionHandler();   // 1st — catch all errors"),
  cd("app.UseRouting();            // determine endpoint"),
  cd("app.UseAuthentication();     // WHO are you?"),
  cd("app.UseAuthorization();      // are you ALLOWED?"),
  cd("app.UseEndpoints(...);       // execute handler"),
  key("Authentication MUST come before Authorization in the pipeline. Order matters."),
  pb()
);

// REACT NOTES
P.push(
  h1("REACT NOTES"),
  h2("Core Concepts"),
  tbl(["Concept","Definition","Key Rule"],
    [["Component","Reusable UI unit (function or class)","Function components = modern standard"],
     ["Props","Data passed parent→child","READ-ONLY in child (immutable)"],
     ["State","Mutable data within component","Changing state = triggers re-render"],
     ["Virtual DOM","In-memory DOM copy","React diffs VDOM → updates only changed real DOM parts"],
     ["JSX","HTML-like syntax in JS","Compiles to React.createElement() calls"]],
    [2000,3000,4360]),
  ...el(),
  h2("Hooks Quick Reference"),
  tbl(["Hook","Purpose","Key Rule"],
    [["useState","Manage component state","setter is ASYNC and BATCHED"],
     ["useEffect","Side effects: fetch, subscriptions","Dependency array controls when it runs"],
     ["useContext","Consume context value","Avoid prop drilling across many levels"],
     ["useRef","DOM access / persist value without re-render","Changing ref.current does NOT trigger re-render"],
     ["useMemo","Memoize computed VALUE","Re-computes only when dependencies change"],
     ["useCallback","Memoize FUNCTION reference","Prevents child re-render when fn passed as prop"],
     ["useReducer","Complex state logic (like Redux)","Use when state transitions are complex"]],
    [2000,3200,4160]),
  ...el(),
  h2("useEffect Dependency Array"),
  tbl(["Array","When Effect Runs","Equivalent Class Method"],
    [["Not provided","After EVERY render","componentDidUpdate"],
     ["[] empty","ONCE after first render only","componentDidMount"],
     ["[dep1, dep2]","After mount + when deps change","componentDidUpdate with condition"]],
    [2200,3800,3360]),
  trap("useEffect with setState and NO dependency array = INFINITE LOOP (effect runs → setState → re-render → effect runs again)."),
  ...el(),
  h2("Props vs State"),
  tbl(["Aspect","Props","State"],
    [["Owner","Parent component","Component itself"],
     ["Mutable?","NO — read-only in child","YES — via useState setter"],
     ["Triggers re-render?","Yes (parent passes new props)","Yes (when updated)"],
     ["Access","this.props (class) / function arg","useState() hook / this.state"],
     ["Purpose","Pass data DOWN the tree","Track internal, changing data"]],
    [2400,3480,3480]),
  pb()
);

// SQL NOTES
P.push(
  h1("SQL NOTES"),
  h2("JOINs"),
  tbl(["Join","Returns","NULL?"],
    [["INNER JOIN","Matching rows in BOTH tables","No nulls — only matches"],
     ["LEFT JOIN","ALL left rows + matching right","NULLs in right cols for unmatched left"],
     ["RIGHT JOIN","ALL right rows + matching left","NULLs in left cols for unmatched right"],
     ["FULL OUTER JOIN","ALL rows from both tables","NULLs on both sides"],
     ["CROSS JOIN","Every row × every row (cartesian)","No nulls — all combinations"]],
    [2200,3800,3360]),
  ...el(),
  h2("NULL Rules — Critical"),
  bul("NULL = unknown. NOT zero, NOT empty string."),
  bul("NULL = NULL → evaluates to UNKNOWN (not TRUE). Use IS NULL."),
  bul("5 + NULL = NULL. Any arithmetic with NULL = NULL."),
  bul("COUNT(*) counts ALL rows. COUNT(col) skips NULLs."),
  bul("AVG/SUM/MIN/MAX all IGNORE NULLs."),
  bul("COALESCE(a,b,c) = return first non-NULL value."),
  trap("WHERE col = NULL returns ZERO rows. Always use WHERE col IS NULL."),
  ...el(),
  h2("GROUP BY + HAVING vs WHERE"),
  cd("SELECT dept, COUNT(*), AVG(salary)"),
  cd("FROM employees"),
  cd("WHERE salary > 30000        -- filters ROWS (before grouping, no aggregates)"),
  cd("GROUP BY dept"),
  cd("HAVING COUNT(*) > 5         -- filters GROUPS (after grouping, can use aggregates)"),
  cd("ORDER BY AVG(salary) DESC;"),
  key("WHERE = before GROUP BY (rows). HAVING = after GROUP BY (groups). HAVING can use AVG/COUNT; WHERE cannot."),
  ...el(),
  h2("SQL Execution Order (Logical)"),
  ascii([
    "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
    "(This is why you CANNOT use SELECT aliases in WHERE clause)",
  ]),
  pb()
);

// STEP 3: MCQs
P.push(...secHdr("STEP 3 — MCQ PRACTICE","115 Questions | Sections A–D | Answer + Explanation After Each Question"));
P.push(h1("SECTION A: CORE CS — OS, DBMS, OOP, DSA (45 Questions)"));
P.push(h2("Operating System — 15 Questions"));
qn=0;
P.push(...Q("Which CPU scheduling algorithm may cause starvation?",
  ["a) Round Robin","b) FCFS","c) Priority Scheduling","d) Multilevel Feedback Queue"],
  "c) Priority Scheduling",
  "Low-priority processes may never get CPU if high-priority processes keep arriving. MLFQ has aging so it prevents starvation."));

P.push(...Q("SRTF is the preemptive version of which scheduling algorithm?",
  ["a) FCFS","b) Round Robin","c) SJF","d) Priority Scheduling"],
  "c) SJF",
  "SRTF = Shortest Remaining Time First = Preemptive SJF. New shorter process preempts current running process."));

P.push(...Q("What is the 'Convoy Effect' in FCFS scheduling?",
  ["a) Short processes starve indefinitely","b) Short processes wait behind one long process","c) Context switch overhead is very high","d) CPU is idle even when processes are waiting"],
  "b) Short processes wait behind one long process",
  "In FCFS, one long-burst process holds CPU while many short processes wait — like cars stuck behind a slow truck."));

P.push(...Q("Which page replacement algorithm suffers from Belady's Anomaly?",
  ["a) LRU","b) OPT (Optimal)","c) FIFO","d) LFU"],
  "c) FIFO",
  "Only FIFO can show more page faults when more frames are added. LRU and Optimal are 'stack algorithms' and are immune."));

P.push(...Q("Which of the following is NOT a necessary condition for deadlock?",
  ["a) Mutual Exclusion","b) Hold and Wait","c) Preemption","d) Circular Wait"],
  "c) Preemption",
  "The four necessary conditions (Coffman) are: Mutual Exclusion, Hold & Wait, NO Preemption, Circular Wait. Having preemption actually PREVENTS deadlock."));

P.push(...Q("Banker's Algorithm is used for:",
  ["a) Deadlock Prevention","b) Deadlock Avoidance","c) Deadlock Detection","d) Deadlock Recovery"],
  "b) Deadlock Avoidance",
  "Banker's checks safe state before granting resources — this is AVOIDANCE. Prevention = eliminating one of the 4 conditions."));

P.push(...Q("Which scheduling algorithm has no starvation and is fairest for all processes?",
  ["a) SJF","b) Priority Scheduling","c) Round Robin","d) SRTF"],
  "c) Round Robin",
  "Round Robin gives each process a fixed time quantum in rotation — no process is permanently denied CPU."));

P.push(...Q("What does the semaphore wait(P) operation do?",
  ["a) Increments the semaphore","b) Decrements the semaphore","c) Signals another process","d) Creates a new semaphore"],
  "b) Decrements the semaphore",
  "wait(P) = proberen (try) = decrement. If S≤0, block. signal(V) = verhogen (increment). P decrements (acquire), V increments (release)."));

P.push(...Q("Paging in memory management eliminates which type of fragmentation?",
  ["a) Internal fragmentation","b) External fragmentation","c) Both types","d) Neither type"],
  "b) External fragmentation",
  "Paging uses fixed-size frames — no holes between frames, so no external fragmentation. It does have internal fragmentation in the last page."));

P.push(...Q("What happens during a context switch?",
  ["a) CPU executes system call","b) CPU saves PCB of current process and loads PCB of next process","c) CPU allocates new memory pages","d) CPU flushes all cache"],
  "b) CPU saves PCB of current process and loads PCB of next process",
  "Context switch = pure overhead. CPU saves state (PC, registers, etc.) of running process into PCB, then loads state of next scheduled process."));

P.push(...Q("Which IPC mechanism is FASTEST for communication between processes on the same machine?",
  ["a) Message Passing","b) Pipes","c) Shared Memory","d) Sockets"],
  "c) Shared Memory",
  "Shared memory: processes map same physical memory region — direct read/write with no kernel involvement after setup. Fastest IPC."));

P.push(...Q("Thrashing occurs when:",
  ["a) CPU utilization reaches 100%","b) Too many processes cause constant page swapping, reducing CPU utilization","c) One process monopolizes the CPU","d) The ready queue overflows"],
  "b) Too many processes cause constant page swapping, reducing CPU utilization",
  "Thrashing: processes spend more time handling page faults than executing. CPU utilization drops dramatically."));

P.push(...Q("Which process state transition occurs when an I/O request completes?",
  ["a) Ready → Running","b) Running → Waiting","c) Waiting → Ready","d) Ready → Waiting"],
  "c) Waiting → Ready",
  "When I/O completes, the blocked (waiting) process moves to the Ready queue to wait for CPU. Scheduler then picks it up."));

P.push(...Q("A binary semaphore has values:",
  ["a) 0 to infinity","b) 0 or 1 only","c) -1 to 1","d) 1 to n"],
  "b) 0 or 1 only",
  "Binary semaphore = values only 0 or 1. Acts like a mutex. Counting semaphore = 0 to N, controls N resources."));

P.push(...Q("In the context of threads, what does 'race condition' mean?",
  ["a) Threads competing for CPU time","b) Outcome depends on the order threads execute — leads to unpredictable results","c) One thread always executes faster","d) Threads waiting in a circular dependency"],
  "b) Outcome depends on the order threads execute — leads to unpredictable results",
  "Race condition: multiple threads access shared data without synchronization. Result varies by execution order. Fix: mutex/semaphore."));

P.push(h2("DBMS — 15 Questions"));

P.push(...Q("Which normal form removes TRANSITIVE DEPENDENCY?",
  ["a) 1NF","b) 2NF","c) 3NF","d) BCNF"],
  "c) 3NF",
  "Transitive dependency: non-key attr depends on another non-key attr. 3NF removes this. Memory: 3NF = 'no chains between non-keys'."));

P.push(...Q("Which normal form removes PARTIAL DEPENDENCY?",
  ["a) 1NF","b) 2NF","c) 3NF","d) BCNF"],
  "b) 2NF",
  "Partial dependency: non-key attr depends on only PART of a composite PK. 2NF requires full PK dependency."));

P.push(...Q("What does SELECT 5 + NULL return in SQL?",
  ["a) 5","b) 0","c) NULL","d) Error"],
  "c) NULL",
  "Any arithmetic with NULL = NULL. NULL represents unknown. Unknown + 5 = unknown."));

P.push(...Q("What is TRUE about NULL comparisons in SQL?",
  ["a) NULL = NULL is TRUE","b) NULL = NULL is FALSE","c) NULL = NULL is NULL (unknown)","d) NULL comparisons raise exceptions"],
  "c) NULL = NULL is NULL (unknown)",
  "NULL is not equal to anything — even itself. NULL = NULL → UNKNOWN. Always use IS NULL or IS NOT NULL."));

P.push(...Q("Which key allows NULL values?",
  ["a) Primary Key only","b) Unique Key and Foreign Key","c) Primary Key and Foreign Key","d) Only Foreign Key"],
  "b) Unique Key and Foreign Key",
  "Primary Key: NOT NULL. Unique Key: allows ONE NULL. Foreign Key: can be NULL (means no relationship). This is a classic MCQ trap."));

P.push(...Q("COUNT(*) vs COUNT(column) — what is the difference?",
  ["a) No difference","b) COUNT(*) counts all rows; COUNT(col) counts only non-NULL values","c) COUNT(col) is faster always","d) COUNT(*) ignores duplicates"],
  "b) COUNT(*) counts all rows; COUNT(col) counts only non-NULL values",
  "COUNT(*) counts every row. COUNT(salary) skips rows where salary IS NULL."));

P.push(...Q("Which SQL clause filters data AFTER GROUP BY?",
  ["a) WHERE","b) ORDER BY","c) HAVING","d) FILTER"],
  "c) HAVING",
  "WHERE filters rows before grouping. HAVING filters groups after GROUP BY and CAN use aggregate functions (AVG, COUNT, SUM)."));

P.push(...Q("The 'I' in ACID stands for:",
  ["a) Indexing","b) Integrity","c) Isolation","d) Integration"],
  "c) Isolation",
  "ACID = Atomicity (all-or-nothing), Consistency (valid state), Isolation (no interference), Durability (persists on crash)."));

P.push(...Q("Which JOIN returns ONLY rows that have matching values in BOTH tables?",
  ["a) LEFT JOIN","b) FULL OUTER JOIN","c) INNER JOIN","d) RIGHT JOIN"],
  "c) INNER JOIN",
  "INNER JOIN = intersection. Only matching rows. LEFT/RIGHT/FULL OUTER include non-matching rows with NULLs."));

P.push(...Q("A CLUSTERED INDEX:",
  ["a) Can have multiple per table","b) Is a separate structure from the table","c) Stores table rows in sorted order of the index key","d) Allows NULL values in the key column"],
  "c) Stores table rows in sorted order of the index key",
  "Clustered index = the actual table data is physically stored in index order. Only ONE per table. Primary key usually creates clustered index."));

P.push(...Q("What is a FOREIGN KEY?",
  ["a) A key that uniquely identifies each row","b) A field referencing the PK of another table to enforce referential integrity","c) A key with no null values allowed","d) A composite key across two tables"],
  "b) A field referencing the PK of another table to enforce referential integrity",
  "FK ensures a value must exist in the referenced table's PK (or be NULL). Prevents orphan records."));

P.push(...Q("What is the difference between DELETE and TRUNCATE?",
  ["a) No difference","b) DELETE is DDL; TRUNCATE is DML","c) DELETE is DML (can rollback, fires triggers); TRUNCATE is DDL (faster, usually cannot rollback)","d) TRUNCATE can use WHERE clause"],
  "c) DELETE is DML (can rollback, fires triggers); TRUNCATE is DDL (faster, usually cannot rollback)",
  "DELETE: row-by-row, logged, can rollback, fires triggers. TRUNCATE: deallocates pages, much faster, DDL, no triggers."));

P.push(...Q("What does COALESCE(NULL, NULL, 5, 10) return?",
  ["a) NULL","b) 10","c) 5","d) Error"],
  "c) 5",
  "COALESCE returns the FIRST non-NULL value from left to right. NULL → NULL → 5 (first non-null) → returns 5."));

P.push(...Q("Which SQL command is used to grant permissions to a user?",
  ["a) ALLOW","b) PERMIT","c) GRANT","d) ASSIGN"],
  "c) GRANT",
  "DCL (Data Control Language) = GRANT and REVOKE. GRANT gives permissions; REVOKE removes them."));

P.push(...Q("Referential integrity is maintained by:",
  ["a) Primary Key","b) Unique Key","c) Foreign Key","d) Check Constraint"],
  "c) Foreign Key",
  "Foreign Key constraint ensures that a value in one table exists in the referenced table's primary key — this is referential integrity."));

P.push(h2("OOP — 10 Questions"));

P.push(...Q("Method overriding is an example of which type of binding?",
  ["a) Static binding (compile-time)","b) Dynamic binding (runtime)","c) Early binding","d) Link-time binding"],
  "b) Dynamic binding (runtime)",
  "Method overriding uses dynamic/late binding — the correct method implementation is chosen at RUNTIME based on actual object type."));

P.push(...Q("Method overloading is resolved at:",
  ["a) Runtime","b) Compile-time","c) Link time","d) Load time"],
  "b) Compile-time",
  "Overloading = static binding. Compiler determines which overloaded version to call based on argument types at compile time."));

P.push(...Q("Which OOP principle is violated if a subclass method throws an exception not thrown by the parent?",
  ["a) Single Responsibility","b) Open/Closed","c) Liskov Substitution","d) Dependency Inversion"],
  "c) Liskov Substitution",
  "Liskov Substitution Principle (L in SOLID): Subclass must be substitutable for parent without breaking behavior. Unexpected exceptions break this."));

P.push(...Q("What is the diamond problem in OOP?",
  ["a) Class with too many methods","b) Ambiguity when a class inherits from two classes sharing a common ancestor","c) Performance issue with deep inheritance","d) Memory leak in recursive objects"],
  "b) Ambiguity when a class inherits from two classes sharing a common ancestor",
  "D inherits from B and C, both inheriting from A. If both B and C override A's method, D doesn't know which to call. Java/C# avoid this by preventing multiple class inheritance."));

P.push(...Q("Composition is preferred over inheritance because:",
  ["a) Composition is always faster","b) Composition allows changing behavior at runtime and avoids tight coupling","c) Composition uses less memory","d) Inheritance is deprecated in modern OOP"],
  "b) Composition allows changing behavior at runtime and avoids tight coupling",
  "'Favour composition over inheritance' (GoF). HAS-A is more flexible than IS-A. Can swap components at runtime; inheritance is fixed at compile time."));

P.push(...Q("What does Encapsulation achieve?",
  ["a) Code reuse through inheritance","b) Multiple behaviors from one interface","c) Data hiding and controlled access through public methods","d) Eliminating the need for constructors"],
  "c) Data hiding and controlled access through public methods",
  "Encapsulation: private fields + public getters/setters. Protects data integrity (e.g., can't set negative balance) and allows implementation to change without affecting callers."));

P.push(...Q("An abstract class differs from an interface in that:",
  ["a) Abstract classes cannot have any methods","b) Abstract classes can have constructors and concrete methods; interfaces cannot (pre-C# 8)","c) Interfaces can be instantiated but abstract classes cannot","d) Abstract classes support multiple inheritance"],
  "b) Abstract classes can have constructors and concrete methods; interfaces cannot (pre-C# 8)",
  "Abstract class: constructor YES, concrete methods YES, single inheritance. Interface: no constructor, all abstract (C# 8 adds defaults), multiple implementation."));

P.push(...Q("What is polymorphism in practice?",
  ["a) A class having multiple constructors","b) Animal a = new Dog(); a.Speak(); calls Dog's Speak() at runtime","c) A method with multiple parameters","d) A class implementing multiple interfaces"],
  "b) Animal a = new Dog(); a.Speak(); calls Dog's Speak() at runtime",
  "Runtime polymorphism: reference type is Animal but actual object is Dog. At runtime, Dog's Speak() is invoked — not Animal's."));

P.push(...Q("Which SOLID principle states each class should have only ONE reason to change?",
  ["a) Open/Closed","b) Single Responsibility","c) Interface Segregation","d) Dependency Inversion"],
  "b) Single Responsibility",
  "S = Single Responsibility Principle. A class should do one thing. If a class handles data AND logging AND email, it has multiple reasons to change."));

P.push(...Q("Abstraction in OOP means:",
  ["a) Hiding implementation details and showing only essential features","b) Creating multiple objects from one class","c) Preventing a class from being modified","d) Sharing code between classes"],
  "a) Hiding implementation details and showing only essential features",
  "Abstraction = show WHAT (interface) not HOW (implementation). car.start() — you don't need to know fuel injection sequence to drive."));

P.push(h2("DSA — 5 Questions"));

P.push(...Q("What is the time complexity of binary search on a sorted array?",
  ["a) O(n)","b) O(n²)","c) O(log n)","d) O(1)"],
  "c) O(log n)",
  "Binary search halves the search space each step. log₂(n) steps to reach 1 element."));

P.push(...Q("Merge Sort has which time complexity in WORST case?",
  ["a) O(n²)","b) O(n log n)","c) O(n)","d) O(log n)"],
  "b) O(n log n)",
  "Merge Sort is always O(n log n) — best, average, AND worst case. Unlike Quick Sort which is O(n²) worst case."));

P.push(...Q("Which data structure uses LIFO (Last In First Out)?",
  ["a) Queue","b) Heap","c) Stack","d) Linked List"],
  "c) Stack",
  "Stack = LIFO. Queue = FIFO. Stack used in function calls, DFS, undo operations."));

P.push(...Q("Average time complexity of a hash table lookup is:",
  ["a) O(log n)","b) O(n)","c) O(1)","d) O(n log n)"],
  "c) O(1)",
  "Hash table: average O(1) for insert/lookup/delete. Worst case O(n) if all keys collide. Good hash function minimizes collisions."));

P.push(...Q("Inorder traversal of a BST produces:",
  ["a) Random order","b) Reverse sorted order","c) Ascending (sorted) order","d) Level-by-level order"],
  "c) Ascending (sorted) order",
  "Inorder (Left-Root-Right) on a BST visits nodes in ascending sorted order. Key BST property."));

// SECTION B: C#
P.push(pb(), h1("SECTION B: C# + ASP.NET CORE (30 Questions)"));
P.push(h2("C# Language — 18 Questions"));

P.push(...Q("What does 'sealed' keyword do in C#?",
  ["a) Prevents the class from being instantiated","b) Prevents the class from being INHERITED","c) Prevents method overriding","d) Makes all members private"],
  "b) Prevents the class from being INHERITED",
  "'sealed' blocks inheritance. sealed class CAN be instantiated (new SealedClass() is fine). 'abstract' prevents instantiation."));

P.push(...Q("What is the difference between 'const' and 'readonly' in C#?",
  ["a) No difference","b) const is compile-time constant (implicitly static); readonly can be set in constructor at runtime","c) readonly is compile-time; const can be set in constructor","d) const allows instance values; readonly is static only"],
  "b) const is compile-time constant (implicitly static); readonly can be set in constructor at runtime",
  "const: fixed at compile time, implicitly static, must be primitive. readonly: set at declaration OR in constructor, can differ per instance."));

P.push(...Q("What does the 'virtual' keyword indicate in C#?",
  ["a) Method cannot be overridden","b) Method MUST be overridden in child class","c) Method CAN be overridden in child class","d) Method is only callable by child classes"],
  "c) Method CAN be overridden in child class",
  "'virtual' allows (but doesn't require) overriding. 'abstract' FORCES override. 'sealed' prevents override. 'new' hides without overriding."));

P.push(...Q("string s = null; int len = s?.Length ?? 0; — what is the value of len?",
  ["a) Error/exception","b) null","c) 0","d) -1"],
  "c) 0",
  "s?.Length = null (because s is null, null-conditional operator returns null). null ?? 0 = 0 (null-coalescing returns right side when left is null)."));

P.push(...Q("What is the output?\nList<int> a = new(){1,2,3};\nList<int> b = a;\nb.Add(4);\nConsole.Write(a.Count);",
  ["a) 3","b) 4","c) Error","d) 0"],
  "b) 4",
  "List<T> is a reference type. b = a copies the REFERENCE, not the list. Both a and b point to the SAME list. Adding to b adds to the same list a references."));

P.push(...Q("Which of these is a VALUE TYPE in C#?",
  ["a) string","b) class","c) array","d) struct"],
  "d) struct",
  "Value types: int, bool, float, char, struct, enum. Reference types: class, string, array, interface, delegate. 'string' is reference type despite behaving immutably."));

P.push(...Q("What does the 'ref' keyword do when used with a method parameter?",
  ["a) Creates a copy of the variable","b) Passes variable by reference — method changes affect the original","c) Marks parameter as optional","d) Prevents the parameter from being modified"],
  "b) Passes variable by reference — method changes affect the original",
  "ref: pass by reference. Must be initialized before passing. Both ref and out pass by reference. Difference: out doesn't need pre-initialization but must be assigned inside method."));

P.push(...Q("'is' and 'as' operators in C# — what is the difference?",
  ["a) No difference","b) 'is' checks type (returns bool); 'as' casts and returns null if incompatible (no exception)","c) 'as' throws InvalidCastException; 'is' returns null","d) 'is' is for interfaces; 'as' is for classes only"],
  "b) 'is' checks type (returns bool); 'as' casts and returns null if incompatible (no exception)",
  "'is': type check → bool. 'as': safe cast → null on failure. Direct (Type)obj cast throws InvalidCastException on failure."));

P.push(...Q("What is boxing in C#?",
  ["a) Putting a class inside another class","b) Converting a value type to a reference type (object)","c) Wrapping an exception","d) Sealing a class"],
  "b) Converting a value type to a reference type (object)",
  "Boxing: int x = 5; object o = x; — x is copied to heap as boxed object. Unboxing: int y = (int)o; — back to value type. Frequent boxing is expensive."));

P.push(...Q("Which keyword is used to explicitly call a parent class constructor in C#?",
  ["a) parent()","b) super()","c) base()","d) this()"],
  "c) base()",
  "In C#: base() calls parent constructor, base.Method() calls parent method. this() calls another constructor in the same class (constructor chaining)."));

P.push(...Q("What does 'async void' method signature indicate?",
  ["a) Returns a completed Task","b) Is synchronous","c) Fire-and-forget — cannot be awaited; exceptions not catchable by callers","d) Only runs on background thread"],
  "c) Fire-and-forget — cannot be awaited; exceptions not catchable by callers",
  "async void: only for event handlers. Cannot await it. Exceptions thrown inside are lost (unobserved). Always use async Task or async Task<T>."));

P.push(...Q("What is a delegate in C#?",
  ["a) An inherited class","b) A type-safe function pointer — holds reference to a method","c) An asynchronous operation","d) A sealed abstract class"],
  "b) A type-safe function pointer — holds reference to a method",
  "Delegate: Func<int,int,int> add = (a,b) => a+b; — holds reference to a matching method. Func/Action are built-in generic delegates."));

P.push(...Q("Which access modifier in C# makes a member accessible from SUBCLASSES and the same assembly, but not outside?",
  ["a) private","b) internal","c) protected internal","d) public"],
  "c) protected internal",
  "protected internal: accessible from subclasses (any assembly) OR same assembly. protected: subclasses only. internal: same assembly only."));

P.push(...Q("What does LINQ stand for?",
  ["a) Language Integrated Network Query","b) Language Integrated Query","c) Linked Internal Query","d) List Integrated Query"],
  "b) Language Integrated Query",
  "LINQ = Language Integrated Query. Allows querying arrays, lists, XML, EF Core DbSets using C# syntax with compile-time checking."));

P.push(...Q("What is the 'using' statement primarily used for in C#?",
  ["a) Import namespaces only","b) Ensure IDisposable resources are properly disposed even if exception occurs","c) Define type aliases","d) Create singleton objects"],
  "b) Ensure IDisposable resources are properly disposed even if exception occurs",
  "using(var conn = new SqlConnection(cs)){...} — Dispose() called when block exits, even on exception. Equivalent to try/finally with Dispose()."));

P.push(...Q("In C#, 'string' and 'String' are:",
  ["a) Different: string is a value type","b) Different: String allows null; string does not","c) Exactly the same — string is a C# alias for System.String","d) string is faster than String"],
  "c) Exactly the same — string is a C# alias for System.String",
  "Both are identical. 'string' is a C# language keyword alias for System.String class. Both are reference types."));

P.push(...Q("What is the purpose of the 'params' keyword in C#?",
  ["a) Makes parameter optional with default value","b) Passes parameter by reference","c) Allows passing variable number of arguments","d) Marks parameter as output"],
  "c) Allows passing variable number of arguments",
  "void Print(params int[] nums){} can be called as Print(1), Print(1,2,3), Print(1,2,3,4,5) — any number of int arguments."));

P.push(...Q("What are Generics in C# used for?",
  ["a) Generating code automatically","b) Type-safe code that works with any type without casting","c) Creating abstract classes","d) Defining anonymous types"],
  "b) Type-safe code that works with any type without casting",
  "List<T>, Dictionary<K,V> — the T is a type parameter. Generics provide type safety at compile time without boxing/casting overhead."));

P.push(h2("ASP.NET Core & REST — 12 Questions"));

P.push(...Q("In ASP.NET Core MVC, what does 'Scoped' lifetime mean for a service?",
  ["a) Created once for entire app lifetime","b) Created once per HTTP request","c) Created every time the service is requested","d) Created once per controller action"],
  "b) Created once per HTTP request",
  "Scoped: one instance per HTTP request. Singleton: one for entire app. Transient: new instance every time. DbContext should be Scoped."));

P.push(...Q("What HTTP method should be used to CREATE a new resource?",
  ["a) GET","b) PUT","c) POST","d) PATCH"],
  "c) POST",
  "POST creates a new resource. POST is NOT idempotent — calling twice creates two resources. Response should be 201 Created."));

P.push(...Q("What HTTP status code means 'authenticated user has NO PERMISSION for the resource'?",
  ["a) 401","b) 404","c) 403","d) 400"],
  "c) 403",
  "403 Forbidden: server knows who you are (authenticated) but you're not allowed. 401 Unauthorized: not authenticated (missing/invalid credentials)."));

P.push(...Q("What does [FromBody] attribute do in ASP.NET Core?",
  ["a) Reads from URL query string","b) Reads from route parameters","c) Deserializes JSON from HTTP request body","d) Reads from HTTP headers"],
  "c) Deserializes JSON from HTTP request body",
  "[FromBody]: JSON → C# object from request body. [FromQuery]: ?key=value URL params. [FromRoute]: /api/{id} route segment. [FromHeader]: HTTP header."));

P.push(...Q("What is the correct order of ASP.NET Core middleware execution?",
  ["a) Authorization → Authentication → Routing","b) Routing → Authorization → Authentication","c) Routing → Authentication → Authorization","d) Authentication → Routing → Authorization"],
  "c) Routing → Authentication → Authorization",
  "UseRouting() determines the endpoint. UseAuthentication() identifies the user. UseAuthorization() checks permissions. Order is critical."));

P.push(...Q("What is REST?",
  ["a) A programming language for APIs","b) A database query language","c) An architectural style for APIs using HTTP — stateless, resource-based","d) A security protocol for web services"],
  "c) An architectural style for APIs using HTTP — stateless, resource-based",
  "REST = Representational State Transfer. Key constraints: stateless (no server session), resources identified by URLs, standard HTTP methods."));

P.push(...Q("In Entity Framework Core, which approach defines C# classes first and generates the database?",
  ["a) Database-First","b) Code-First","c) Schema-First","d) Migration-Only"],
  "b) Code-First",
  "Code-First: define C# entity classes → add migration → apply migration (creates DB). Database-First: existing DB → generate C# models (scaffold)."));

P.push(...Q("What does Dependency Injection (DI) solve?",
  ["a) Database connection pooling","b) Tight coupling — classes receive dependencies externally instead of creating them","c) Thread synchronization","d) Memory management"],
  "b) Tight coupling — classes receive dependencies externally instead of creating them",
  "DI: instead of new MyService() inside a class, the container injects IMyService. Easy to swap implementations, easy to unit test with mocks."));

P.push(...Q("What is CORS and why is it needed?",
  ["a) A caching mechanism for APIs","b) Cross-Origin Resource Sharing — allows browsers to call APIs on different domains","c) A security token format","d) A compression algorithm for HTTP"],
  "b) Cross-Origin Resource Sharing — allows browsers to call APIs on different domains",
  "Browser blocks cross-origin requests by default. React on localhost:3000 calling API on localhost:5000 = cross-origin. Server must send CORS headers to allow it."));

P.push(...Q("Which attribute maps a controller action to HTTP GET in ASP.NET Core?",
  ["a) [HttpPost]","b) [ApiController]","c) [HttpGet]","d) [Route(\"get\")]"],
  "c) [HttpGet]",
  "[HttpGet], [HttpPost], [HttpPut], [HttpDelete], [HttpPatch] map actions to HTTP methods. [ApiController] enables automatic model validation."));

P.push(...Q("What HTTP status code should a POST that successfully creates a resource return?",
  ["a) 200 OK","b) 201 Created","c) 204 No Content","d) 202 Accepted"],
  "b) 201 Created",
  "201 Created: includes Location header pointing to new resource. 200 OK for GET success. 204 for DELETE/PUT with no response body."));

P.push(...Q("What is the purpose of a JWT (JSON Web Token) in REST APIs?",
  ["a) Encrypts the request body","b) Stateless authentication — encodes user identity/claims, signed by server","c) Manages database connections","d) Handles CORS preflight requests"],
  "b) Stateless authentication — encodes user identity/claims, signed by server",
  "JWT: header.payload.signature. Server signs it; client sends it in every request (Authorization: Bearer <token>). Server verifies signature — no session storage needed."));

// SECTION C: REACT
P.push(pb(), h1("SECTION C: REACT + WEB (25 Questions)"));

P.push(...Q("What does the Virtual DOM in React improve?",
  ["a) Server-side rendering speed","b) Performance by minimizing direct real DOM manipulation","c) Database query speed","d) Network request efficiency"],
  "b) Performance by minimizing direct real DOM manipulation",
  "React keeps VDOM in memory. On state change: diff new VDOM vs old VDOM → update only changed parts in real DOM. Real DOM manipulation is expensive."));

P.push(...Q("What is wrong with this code?\nconst [count, setCount] = useState(0);\ncount = 5;",
  ["a) useState should take a string","b) count is read-only — never mutate state directly; use setCount(5)","c) setCount must be called before count can be read","d) useState cannot be initialized with a number"],
  "b) count is read-only — never mutate state directly; use setCount(5)",
  "State values are read-only. Directly assigning count = 5 won't trigger re-render and breaks React's state management. Always use the setter."));

P.push(...Q("useEffect(() => { fetchData(); }, []) — when does fetchData() run?",
  ["a) After every render","b) Before first render","c) Once after first render (mount) only","d) Only when fetchData changes"],
  "c) Once after first render (mount) only",
  "Empty dependency array [] = run once after first render. Equivalent to componentDidMount in class components."));

P.push(...Q("What is 'prop drilling'?",
  ["a) Accessing nested object properties in props","b) Passing props through intermediate components that don't need them to reach a deep child","c) Overriding parent props in child","d) Validating prop types with PropTypes"],
  "b) Passing props through intermediate components that don't need them to reach a deep child",
  "A→B→C→D just to pass data from A to D. B and C don't use the prop but must forward it. Solution: Context API or state management."));

P.push(...Q("Why must list items in React have unique 'key' props?",
  ["a) For CSS styling","b) For accessibility","c) To help React's reconciliation identify which items changed/added/removed","d) To sort the list automatically"],
  "c) To help React's reconciliation identify which items changed/added/removed",
  "Without stable unique keys, React can't efficiently update lists. Using array index as key causes issues when list order changes."));

P.push(...Q("What is the difference between useMemo and useCallback?",
  ["a) They are identical","b) useMemo memoizes a computed VALUE; useCallback memoizes a FUNCTION reference","c) useMemo is for async; useCallback is for sync","d) useCallback runs before render; useMemo after"],
  "b) useMemo memoizes a computed VALUE; useCallback memoizes a FUNCTION reference",
  "useMemo(() => compute(a,b), [a,b]) → memoized value. useCallback(() => handler(), [dep]) → memoized function. Both prevent unnecessary recalculations."));

P.push(...Q("React's one-way data flow means:",
  ["a) Data can only flow from child to parent","b) Data only flows top-down (parent to child) via props","c) Data is immutable at all times","d) Only one component can have state"],
  "b) Data only flows top-down (parent to child) via props",
  "Parent passes data via props. Child can communicate UP only by calling callback functions passed as props — not by directly modifying parent state."));

P.push(...Q("What does React.memo do?",
  ["a) Memoizes state values","b) Prevents component re-render when props haven't changed (shallow comparison)","c) Caches API responses","d) Persists data in localStorage"],
  "b) Prevents component re-render when props haven't changed (shallow comparison)",
  "React.memo wraps functional component. If parent re-renders but props are same (shallow equal), wrapped component skips re-render. Performance optimization."));

P.push(...Q("What is JSX?",
  ["a) A JavaScript extension for network requests","b) Syntactic sugar that compiles to React.createElement() calls","c) A CSS-in-JS library","d) A JavaScript runtime"],
  "b) Syntactic sugar that compiles to React.createElement() calls",
  "JSX: <div className='box'>Hello</div> → React.createElement('div', {className:'box'}, 'Hello'). Babel transpiles JSX to JS."));

P.push(...Q("Which hook provides access to a DOM element or persists a mutable value WITHOUT causing a re-render?",
  ["a) useState","b) useEffect","c) useRef","d) useMemo"],
  "c) useRef",
  "useRef: 1) const el = useRef(null); <input ref={el}> — access DOM node via el.current. 2) Store value that persists across renders without triggering re-render."));

P.push(...Q("What triggers a component re-render in React?",
  ["a) Any JavaScript variable change","b) setState/useState setter call OR parent component re-render","c) Only explicit forceUpdate() calls","d) Window resize event only"],
  "b) setState/useState setter call OR parent component re-render",
  "Re-render triggers: (1) Own state changes, (2) Parent re-renders (passing new props), (3) Context value changes. Optimize with React.memo, useMemo."));

P.push(...Q("Which React hook runs CLEANUP when a component is UNMOUNTED?",
  ["a) useState","b) Return function from useEffect","c) useCallback","d) useLayoutEffect only"],
  "b) Return function from useEffect",
  "useEffect can return a cleanup function: useEffect(() => { subscribe(); return () => unsubscribe(); }, []); — cleanup runs on unmount (or before next effect)."));

P.push(...Q("What is the Context API used for?",
  ["a) Managing server state","b) Sharing state across component tree without prop drilling","c) Caching API responses","d) Route management"],
  "b) Sharing state across component tree without prop drilling",
  "createContext() → Provider wraps tree → useContext() in any child. Commonly used for theme, auth, language without passing as props everywhere."));

P.push(...Q("In React Router v6, which component wraps all route definitions?",
  ["a) Switch","b) Router","c) Routes","d) RouterProvider"],
  "c) Routes",
  "React Router v6: <Routes> replaced <Switch>. Routes renders FIRST matching route. Basic structure: <BrowserRouter><Routes><Route path='/' element={<Home/>}/></Routes></BrowserRouter>."));

P.push(...Q("What is a controlled component in React forms?",
  ["a) A component managed by a parent","b) Form element whose value is controlled by React state (via useState + onChange)","c) A component with no props","d) A component using Redux for state"],
  "b) Form element whose value is controlled by React state (via useState + onChange)",
  "<input value={name} onChange={e => setName(e.target.value)}> — React drives the form. The state IS the single source of truth for the input value."));

P.push(...Q("What does 'reconciliation' mean in React?",
  ["a) Merging multiple React apps","b) React's diffing algorithm that compares Virtual DOM trees to find minimal real DOM changes","c) Syncing state with a database","d) Resolving component naming conflicts"],
  "b) React's diffing algorithm that compares Virtual DOM trees to find minimal real DOM changes",
  "When state changes: React creates new VDOM → compares (diffs) with previous VDOM → applies only necessary changes to real DOM."));

P.push(...Q("What happens if you set state inside useEffect with no dependency array?",
  ["a) State is set once and effect stops","b) No effect","c) Infinite loop: render→effect→setState→render...","d) Warning but works correctly"],
  "c) Infinite loop: render→effect→setState→render...",
  "No deps array → effect runs after every render. setState inside → triggers re-render. Re-render → runs effect again. Infinite loop. Always specify dependencies!"));

P.push(...Q("How do React synthetic events differ from native browser events?",
  ["a) React doesn't support events","b) Synthetic events wrap native events providing cross-browser consistency","c) React events are asynchronous; native are synchronous","d) React events require jQuery"],
  "b) Synthetic events wrap native events providing cross-browser consistency",
  "React's SyntheticEvent wraps native event with consistent cross-browser API. Events use camelCase (onClick not onclick). Event pooling (though removed in React 17+)."));

P.push(...Q("What is 'lifting state up' in React?",
  ["a) Moving state from functional to class components","b) Moving state to a parent component so siblings can share it","c) Moving state to Redux","d) Converting local state to server state"],
  "b) Moving state to a parent component so siblings can share it",
  "If sibling A and B need to share data, move state to their common parent. Parent holds state, passes data to A via props, passes setter to B as callback."));

P.push(...Q("React is best described as:",
  ["a) A full-stack framework","b) A database ORM","c) A JavaScript LIBRARY for building user interfaces","d) A CSS framework"],
  "c) A JavaScript LIBRARY for building user interfaces",
  "React is a LIBRARY (not a framework) for building UI. It handles view layer only. For routing, state management, HTTP — you add other libraries."));

P.push(...Q("What is a Higher-Order Component (HOC)?",
  ["a) A component with high CSS specificity","b) A function that takes a component and returns an enhanced component","c) The root component of the app","d) A component with more than 10 props"],
  "b) A function that takes a component and returns an enhanced component",
  "HOC pattern: const WithAuth = (Component) => (props) => { if(!auth) return <Redirect/>; return <Component {...props}/>; }; — wraps with auth check."));

P.push(...Q("useState setter function characteristics:",
  ["a) Synchronous — state updates immediately","b) Asynchronous and batched — state may not change until after re-render","c) Only works inside class components","d) Can only be called once per render"],
  "b) Asynchronous and batched — state may not change until after re-render",
  "State updates are batched and asynchronous. console.log(count) immediately after setCount(count+1) still shows old count. Use useEffect to react to state changes."));

P.push(...Q("Which hook should you use to avoid expensive recalculations on every render?",
  ["a) useEffect","b) useRef","c) useMemo","d) useState"],
  "c) useMemo",
  "useMemo(() => expensiveCalc(a, b), [a, b]) — only recalculates when a or b changes. Prevents expensive operations from running on every render."));

P.push(...Q("What is the role of 'key' when NOT using lists — for example on a component?",
  ["a) No special role outside lists","b) Changing key forces React to UNMOUNT and REMOUNT the component (reset state)","c) Improves performance always","d) Required for all components"],
  "b) Changing key forces React to UNMOUNT and REMOUNT the component (reset state)",
  "Changing a component's key tells React it's a different component — old unmounts (cleanup runs), new mounts fresh. Useful to reset component state."));

P.push(...Q("What does the useReducer hook provide over useState?",
  ["a) Better performance always","b) Complex state transitions with actions and a reducer function (like mini Redux)","c) Access to Redux store","d) Automatic API calls"],
  "b) Complex state transitions with actions and a reducer function (like mini Redux)",
  "useReducer(reducer, initialState) → [state, dispatch]. Good when: multiple sub-values, next state depends on previous, complex state logic."));

P.push(...Q("What does the spread operator do with props? <Component {...props}>",
  ["a) Clones the component","b) Passes all properties of props object as individual props to Component","c) Merges two components","d) Creates a deep copy of props"],
  "b) Passes all properties of props object as individual props to Component",
  "{...props} spreads all key-value pairs. If props = {name:'Sam', age:22}, then <Component {...props}> is same as <Component name='Sam' age={22}>."));

// SECTION D: SQL
P.push(pb(), h1("SECTION D: SQL (20 Questions)"));

P.push(...Q("What is the SQL logical execution order?",
  ["a) SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY","b) FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY","c) WHERE → FROM → SELECT → GROUP BY → ORDER BY","d) FROM → SELECT → WHERE → GROUP BY → HAVING"],
  "b) FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
  "Logical order: FROM (get rows) → WHERE (filter) → GROUP BY (group) → HAVING (filter groups) → SELECT (compute output) → ORDER BY (sort). Why aliases from SELECT don't work in WHERE."));

P.push(...Q("SELECT 10/3 in SQL Server returns:",
  ["a) 3.33","b) 3","c) 4","d) NULL"],
  "b) 3",
  "Integer / integer = integer (truncated, not rounded). 10/3 = 3. For decimal: SELECT CAST(10 AS FLOAT)/3 or SELECT 10.0/3."));

P.push(...Q("What is the result of WHERE age = NULL?",
  ["a) Returns rows where age is null","b) Returns no rows","c) Error","d) Returns all rows"],
  "b) Returns no rows",
  "NULL = NULL is UNKNOWN (never TRUE). WHERE age = NULL returns 0 rows. Correct syntax: WHERE age IS NULL."));

P.push(...Q("Which SQL command removes ALL rows from a table but keeps structure, and generally cannot be rolled back?",
  ["a) DROP","b) DELETE","c) TRUNCATE","d) REMOVE"],
  "c) TRUNCATE",
  "TRUNCATE: DDL, removes all rows by deallocating pages, very fast, usually can't rollback, no triggers fired. DROP removes the entire table. DELETE is DML and can rollback."));

P.push(...Q("What does DISTINCT do in SELECT DISTINCT name FROM employees?",
  ["a) Sorts names alphabetically","b) Returns each unique name only once, removing duplicates","c) Returns names with NULL values only","d) Groups names by department"],
  "b) Returns each unique name only once, removing duplicates",
  "SELECT DISTINCT eliminates duplicate rows in the result set. Works on all selected columns combined."));

P.push(...Q("Which query correctly finds employees with salary ABOVE AVERAGE?",
  ["a) SELECT * FROM emp WHERE salary > AVG(salary)","b) SELECT * FROM emp WHERE salary > (SELECT AVG(salary) FROM emp)","c) SELECT * FROM emp HAVING salary > AVG(salary)","d) SELECT * FROM emp WHERE salary > AVERAGE"],
  "b) SELECT * FROM emp WHERE salary > (SELECT AVG(salary) FROM emp)",
  "Aggregate functions can't be used directly in WHERE. Use subquery to compute AVG first. HAVING is only used after GROUP BY."));

P.push(...Q("LEFT JOIN ... WHERE B.id IS NULL — what does this return?",
  ["a) All rows from A","b) All matching rows","c) Rows from A with NO match in B (anti-join)","d) All rows from B"],
  "c) Rows from A with NO match in B (anti-join)",
  "LEFT JOIN gives all A rows with NULLs in B columns for non-matches. WHERE B.id IS NULL filters to ONLY non-matching rows. Classic anti-join pattern."));

P.push(...Q("What is the difference between WHERE and HAVING?",
  ["a) No difference","b) WHERE filters before GROUP BY (rows); HAVING filters after GROUP BY (groups, can use aggregates)","c) HAVING is for filtering rows; WHERE is for groups","d) WHERE can use aggregate functions; HAVING cannot"],
  "b) WHERE filters before GROUP BY (rows); HAVING filters after GROUP BY (groups, can use aggregates)",
  "WHERE: pre-grouping row filter, no aggregates. HAVING: post-grouping filter, CAN use AVG/COUNT/SUM. Common exam reversal trap."));

P.push(...Q("What does COALESCE(NULL, NULL, 7, NULL) return?",
  ["a) NULL","b) 7","c) 0","d) Error"],
  "b) 7",
  "COALESCE returns first non-NULL value scanning left to right. NULL→NULL→7 (first non-null) → returns 7."));

P.push(...Q("Which query finds the second highest salary? (Standard approach)",
  ["a) SELECT MAX(salary) FROM emp WHERE salary != MAX(salary)","b) SELECT MAX(salary) FROM emp WHERE salary < (SELECT MAX(salary) FROM emp)","c) SELECT salary FROM emp LIMIT 1 OFFSET 1","d) SELECT TOP 2 salary FROM emp"],
  "b) SELECT MAX(salary) FROM emp WHERE salary < (SELECT MAX(salary) FROM emp)",
  "Subquery finds highest salary. Outer query finds MAX that is less than that. This is the second highest. DENSE_RANK approach also works for any Nth."));

P.push(...Q("In GROUP BY, what is TRUE?",
  ["a) Every column in SELECT must be in GROUP BY OR be aggregated","b) GROUP BY and ORDER BY are the same thing","c) GROUP BY works only with COUNT","d) Every column must be aggregated when GROUP BY is used"],
  "a) Every column in SELECT must be in GROUP BY OR be aggregated",
  "Rule: In SELECT with GROUP BY, each column must either appear in GROUP BY clause OR be inside an aggregate function (SUM, AVG, COUNT, etc.)."));

P.push(...Q("Which isolation level allows DIRTY READS?",
  ["a) READ COMMITTED","b) REPEATABLE READ","c) SERIALIZABLE","d) READ UNCOMMITTED"],
  "d) READ UNCOMMITTED",
  "READ UNCOMMITTED: lowest isolation; allows reading uncommitted (possibly rolled-back) changes. READ COMMITTED prevents dirty reads."));

P.push(...Q("What is an INDEX used for in SQL?",
  ["a) Speeds up both reads and writes equally","b) Speeds up SELECT queries; adds overhead to INSERT/UPDATE/DELETE","c) Enforces uniqueness only","d) Reduces table storage size"],
  "b) Speeds up SELECT queries; adds overhead to INSERT/UPDATE/DELETE",
  "Index = separate data structure for fast lookup. Every index maintained on every write. Don't over-index write-heavy tables."));

P.push(...Q("What does GROUP BY dept with COUNT(*) do?",
  ["a) Returns one row per employee in each dept","b) Groups all employees by department and counts employees in each group","c) Filters rows where dept is not null","d) Sorts employees by department"],
  "b) Groups all employees by department and counts employees in each group",
  "GROUP BY dept puts same-dept employees together. COUNT(*) counts rows in each group. Result: one row per department with count."));

P.push(...Q("What is a VIEW in SQL?",
  ["a) A physical copy of table data","b) A stored procedure","c) A virtual table defined by a SELECT query, no data stored separately","d) An index on multiple columns"],
  "c) A virtual table defined by a SELECT query, no data stored separately",
  "CREATE VIEW vw_it AS SELECT * FROM emp WHERE dept='IT'; — every query to vw_it executes the underlying SELECT. Good for security, simplification."));

P.push(...Q("Which SQL clause is used to sort results?",
  ["a) SORT BY","b) GROUP BY","c) ORDER BY","d) ARRANGE BY"],
  "c) ORDER BY",
  "ORDER BY col ASC (ascending, default) or ORDER BY col DESC (descending). ORDER BY is the LAST clause logically executed."));

P.push(...Q("What does INNER JOIN return when there are NO matching rows?",
  ["a) All rows from left table","b) All rows from right table","c) No rows (empty result set)","d) NULL for all columns"],
  "c) No rows (empty result set)",
  "INNER JOIN only returns rows that MATCH in both tables. If no matches exist, result is empty. This differs from LEFT/RIGHT JOIN which preserve non-matching rows."));

P.push(...Q("Primary Key vs Unique Key — what is the key difference?",
  ["a) No difference","b) PK: NOT NULL + only one per table. Unique Key: allows ONE NULL + multiple per table","c) PK allows duplicates; Unique Key does not","d) Unique Key cannot be referenced as FK"],
  "b) PK: NOT NULL + only one per table. Unique Key: allows ONE NULL + multiple per table",
  "PK: cannot be NULL, exactly one per table. Unique Key: one NULL allowed, multiple unique constraints per table. Both enforce uniqueness."));

P.push(...Q("What is the purpose of the HAVING clause in this query?\nSELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5",
  ["a) Filter departments with more than 5 employees in each group","b) Filter individual employees earning more than 5","c) Sort departments by employee count","d) Select only 5 rows from each department"],
  "a) Filter departments with more than 5 employees in each group",
  "HAVING COUNT(*) > 5 filters groups (departments) — keeps only departments that have more than 5 employees."));

P.push(...Q("Which SQL statement rolls back a transaction?",
  ["a) UNDO","b) REVERT","c) ROLLBACK","d) CANCEL"],
  "c) ROLLBACK",
  "TCL commands: COMMIT (save transaction permanently), ROLLBACK (undo all changes in transaction), SAVEPOINT (set rollback point within transaction)."));

// STEP 4: ANSWER KEY SUMMARY
P.push(pb(),
  h1("STEP 4 — COMPACT ANSWER KEY"),
  body("Full explanations are embedded after each question. Quick reference:"),
  ...el(),
  h2("Section A: Core CS (Q1–Q45)"),
  tbl(["Q","Ans","Q","Ans","Q","Ans","Q","Ans","Q","Ans"],
    [["1","c","2","c","3","b","4","c","5","c"],
     ["6","b","7","c","8","b","9","b","10","b"],
     ["11","c","12","b","13","c","14","b","15","b"],
     ["16","c","17","b","18","b","19","c","20","b"],
     ["21","b","22","b","23","b","24","c","25","b"],
     ["26","b","27","a","28","b","29","b","30","b"],
     ["31","b","32","c","33","b","34","a","35","c"],
     ["36","b","37","b","38","b","39","c","40","a"],
     ["41","c","42","b","43","c","44","c","45","c"]],
    [800,1000,800,1000,800,1000,800,1000,800,1000]),
  ...el(),
  h2("Section B: C# + ASP.NET (Q46–Q75)"),
  tbl(["Q","Ans","Q","Ans","Q","Ans","Q","Ans","Q","Ans"],
    [["46","b","47","b","48","c","49","c","50","b"],
     ["51","d","52","b","53","b","54","b","55","b"],
     ["56","c","57","b","58","b","59","c","60","b"],
     ["61","b","62","b","63","b","64","c","65","b"],
     ["66","c","67","b","68","b","69","c","70","b"],
     ["71","b","72","c","73","b","74","c","75","b"]],
    [800,1000,800,1000,800,1000,800,1000,800,1000]),
  ...el(),
  h2("Section C: React (Q76–Q100)"),
  tbl(["Q","Ans","Q","Ans","Q","Ans","Q","Ans","Q","Ans"],
    [["76","b","77","b","78","c","79","b","80","c"],
     ["81","b","82","b","83","b","84","b","85","c"],
     ["86","b","87","b","88","b","89","b","90","c"],
     ["91","b","92","b","93","c","94","b","95","b"],
     ["96","b","97","b","98","b","99","b","100","b"]],
    [800,1000,800,1000,800,1000,800,1000,800,1000]),
  ...el(),
  h2("Section D: SQL (Q101–Q115 [wait, Q96–Q115])"),
  tbl(["Q","Ans","Q","Ans","Q","Ans","Q","Ans","Q","Ans"],
    [["101","b","102","b","103","b","104","c","105","b"],
     ["106","b","107","c","108","b","109","b","110","b"],
     ["111","a","112","d","113","b","114","b","115","c"]],
    [800,1000,800,1000,800,1000,800,1000,800,1000]),
  pb()
);

// STEP 5: CHEAT SHEET
P.push(...secHdr("STEP 5 — LAST-MINUTE CHEAT SHEET","Read 15 Minutes Before The Test — All Critical Facts"));
P.push(
  h1("🔥 CHEAT SHEET — EVERYTHING IN ONE PAGE"),
  h2("OS Critical Facts"),
  tbl(["Concept","Answer"],
    [["Starvation","SJF, SRTF, Priority. Fix: AGING"],
     ["No Starvation","Round Robin, FCFS (convoy effect but no starvation)"],
     ["Belady's Anomaly","FIFO only — more frames can INCREASE page faults"],
     ["Deadlock 4 conditions","Mutual Excl + Hold&Wait + No Preemption + Circular Wait"],
     ["Banker's Algorithm","Deadlock AVOIDANCE (checks safe state before granting)"],
     ["Paging","Fixed size, no EXTERNAL frag, has INTERNAL frag"],
     ["Segmentation","Variable size, has EXTERNAL frag, no INTERNAL frag"],
     ["Thrashing","Too many processes → too much paging → CPU drops"],
     ["wait(P)","DECREMENTS semaphore (acquire). signal(V) = INCREMENTS"],
     ["Thread vs Process","Thread: shared memory, lightweight. Process: own memory, heavy"]],
    [3000,6360]),
  ...el(),
  h2("DBMS Critical Facts"),
  tbl(["Concept","Answer"],
    [["1NF → 2NF → 3NF","Remove non-atomic → partial dep → transitive dep"],
     ["2NF","Removes PARTIAL dependency on composite PK"],
     ["3NF","Removes TRANSITIVE dependency (non-key→non-key)"],
     ["NULL trap","WHERE col = NULL → 0 rows. Use IS NULL."],
     ["NULL arithmetic","5 + NULL = NULL. COUNT(*) counts NULLs. COUNT(col) skips NULLs."],
     ["WHERE vs HAVING","WHERE: before group (no agg). HAVING: after group (agg OK)"],
     ["Clustered Index","Data stored in index order. ONE per table."],
     ["TRUNCATE vs DELETE","TRUNCATE: DDL, fast, no rollback. DELETE: DML, logged, rollback OK"]],
    [3000,6360]),
  ...el(),
  h2("C# Critical Facts"),
  tbl(["Concept","Answer"],
    [["sealed","Cannot be INHERITED (can instantiate)"],
     ["abstract","Cannot be INSTANTIATED (must inherit)"],
     ["virtual","CAN be overridden (optional)"],
     ["override","Overrides virtual/abstract (runtime dispatch)"],
     ["const vs readonly","const: compile-time, static. readonly: set in constructor OK"],
     ["ref vs out","ref: init before. out: init inside method. Both by reference"],
     ["is vs as","is: returns bool. as: returns null on fail (no exception)"],
     ["DI: Singleton/Scoped/Transient","Once/Per request/Every time"],
     ["async void","Fire-and-forget, don't use (except events)"],
     ["401 vs 403","401: not authenticated. 403: authenticated, no permission"]],
    [3000,6360]),
  ...el(),
  h2("React Critical Facts"),
  tbl(["Concept","Answer"],
    [["useState","setter is ASYNC+BATCHED. Never mutate state directly"],
     ["useEffect []","Runs ONCE after mount only"],
     ["useEffect (no array)","Runs after EVERY render"],
     ["useEffect + setState (no dep)","INFINITE LOOP"],
     ["Props","READ-ONLY in child. Parent → child direction only."],
     ["useMemo vs useCallback","useMemo: memoizes VALUE. useCallback: memoizes FUNCTION"],
     ["React.memo","Prevents re-render if props unchanged (shallow compare)"],
     ["Virtual DOM","Diff VDOM → update only changed real DOM parts"],
     ["key prop","Unique stable ID per list item. Changing key = remount."],
     ["React is","A LIBRARY (not framework) for building UI"]],
    [3000,6360]),
  ...el(),
  h2("HTTP Methods & Status Codes"),
  tbl(["Method","Idempotent?","Response"],
    [["GET","Yes","200 OK"],["POST","No","201 Created"],["PUT","Yes","200 / 204"],
     ["PATCH","No","200 / 204"],["DELETE","Yes","204 No Content"]],
    [3120,2000,4240]),
  tbl(["Code","Meaning"],
    [["200","OK (success with body)"],["201","Created (POST)"],["204","No Content (DELETE/PUT no body)"],
     ["400","Bad Request (invalid input)"],["401","Unauthorized (not authenticated)"],
     ["403","Forbidden (no permission)"],["404","Not Found"],["500","Internal Server Error"]],
    [1800,7560]),
  pb()
);

// STEP 6: PREDICTED QUESTIONS
P.push(
  h1("STEP 6 — 15 MOST PROBABLE QUESTIONS"),
  body("Based on Samsung EM C# + React role + typical placement OA patterns:"),
  ...el(),
  tbl(["#","Question","Why Predicted"],
    [["1","sealed vs abstract vs virtual vs override — define each","C# OOP keywords are always asked; direct application"],
     ["2","useEffect with different dependency arrays — what runs when?","Most common React hooks MCQ in every assessment"],
     ["3","props vs state — differences and when to use each","Fundamental React; expected in every React OA"],
     ["4","401 vs 403 HTTP status — which is which?","REST API trap; appears in almost every backend OA"],
     ["5","Which scheduling causes starvation? How to fix?","Classic OS MCQ; round robin vs priority"],
     ["6","3NF vs 2NF — which dependency does each remove?","Normalization is in every DBMS section"],
     ["7","const vs readonly in C# — difference with example","C# specific; tests language depth"],
     ["8","INNER JOIN vs LEFT JOIN — output difference","SQL join is universally tested"],
     ["9","NULL = NULL in SQL — what does it evaluate to?","Classic SQL trap; tests NULL understanding"],
     ["10","Virtual DOM — what is it and why does React use it?","Core React concept asked in every React OA"],
     ["11","Singleton vs Scoped vs Transient in ASP.NET Core DI","ASP.NET Core DI lifetimes; C# backend fundamental"],
     ["12","Code-First vs Database-First in EF Core","Entity Framework; relevant to the job role"],
     ["13","COUNT(*) vs COUNT(column) difference","SQL aggregate trap; very commonly missed"],
     ["14","useMemo vs useCallback — when to use each?","Advanced React hooks; differentiating candidates"],
     ["15","Belady's Anomaly — which algorithm? Why?","OS page replacement trap; always in OS sections"]],
    [400,3800,5160]),
  ...el(),
  div(),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(260,80),children:[new TextRun({text:"ALL THE BEST FOR YOUR SAMSUNG OA! 🚀",bold:true,size:32,font:"Arial",color:C.red})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(0,80),children:[new TextRun({text:"115 MCQs covered • All sections done • Cheat sheet ready • Predicted questions identified",size:21,font:"Arial",color:"444444",italics:true})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(0,180),children:[new TextRun({text:"Stay calm. Read every option. Trust your preparation. You've got this! ✅",bold:true,size:22,font:"Arial",color:C.blue})]}),
);
return P;
}

const doc=new Document({
  styles:{default:{document:{run:{font:"Arial",size:21}}}},
  numbering:{config:[
    {reference:"bull",levels:[{level:0,format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:480,hanging:320}}}},{level:1,format:LevelFormat.BULLET,text:"\u25E6",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:840,hanging:320}}}}]},
    {reference:"nums",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:480,hanging:320}}}}]},
  ]},
  sections:[{
    properties:{page:{size:{width:11906,height:16838},margin:{top:1000,right:900,bottom:1000,left:900}}},
    headers:{default:new Header({children:[new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:4,color:"B71C1C"}},children:[new TextRun({text:"Samsung Electro-Mechanics OA Prep  |  C# + React Intern  |  115 MCQs + Notes + Cheat Sheet",size:17,font:"Arial",color:"555555"})]})]})} ,
    footers:{default:new Footer({children:[new Paragraph({border:{top:{style:BorderStyle.SINGLE,size:4,color:"0D47A1"}},tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],children:[new TextRun({text:"OS • DBMS • OOP • C# • ASP.NET • React • SQL",size:16,font:"Arial",color:"777777"}),new TextRun({text:"\tPage ",size:16,font:"Arial",color:"777777"}),new TextRun({children:[PageNumber.CURRENT],size:16,font:"Arial",color:"777777"})]})]}),},
    children:build()
  }]
});

Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync('/mnt/user-data/outputs/Samsung_OA_Prep_Kit_Complete.docx',buf);
  console.log('SUCCESS');
}).catch(e=>{console.error(e.message);process.exit(1);});