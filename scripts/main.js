// From sk7725/TimeControl for testing
let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")];
let maxCap = 2;
function __main__(){
  if(!Vars.headless){
    var tc = new Table();

    Events.on(ClientLoadEvent, () => {
      tc.bottom().left();
      addTable(tc);
      Vars.ui.hudGroup.addChild(tc);
      if(Vars.mobile) tc.moveBy(0, Scl.scl(46));
    });
  }
}
try{
  __main__();
} catch (e){
  Vars.ui.showException("SITUVN's mod exception", e);
}

function addTable(table){
  table.table(Tex.pane, t => {
    let s = new Slider(-8, 8, 1, false);
    let c = null;
    s.setValue(0);
    let l = t.label(() => {
      let v = s.getValue();
      if(v >= 0){
          return "x" + Math.pow(2, v);
      }else{
          return "x1/" + Math.pow(2, Math.abs(v));
      }
    }).growX().width(8.5 * 8).color(Pal.accent);
    let b = t.button(new TextureRegionDrawable(Icon.refresh), 24, () => s.setValue(0)).padLeft(6).get();
    b.getStyle().imageUpColor = Pal.accent;
    t.add(s).padLeft(6).minWidth(200);
    s.moved(v => {
      if(c && c.isChecked() && v > maxCap){
        s.setValue(maxCap);
        return;
      }
      let t = Math.pow(2, v);
      Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * t, 3 * t));
      l.color(Tmp.c1.lerp(cols, (s.getValue() + 8) / 16));
  });
  c = t.check("Max: " + maxCap, true, (v)=>{
      if(v && s.getValue() > maxCap){
        s.setValue(maxCap);
        con.show();
      }
    }).padLeft(6).get();
  });
  table.visibility = () => {
    if(!Vars.ui.hudfrag.shown || Vars.ui.minimapfrag.shown()) return false;
    if(!Vars.mobile) return true;
    
    let input = Vars.control.input;
    return input.lastSchematic == null || input.selectPlans.isEmpty();
  };
}

function ConsoleDialog(){
  let dlg = new BaseDialog("Console");
  dlg.addCloseButton();
  let info = new Table().top().left();
  dlg.cont.pane(info).top().left().grow();
  dlg.cont.row();
  let inp = dlg.cont.field("", (s)=>{
    inp.clearText();
    if(s == ":credit"){
      //dlg.hide();
      cre.show();
    }else if(s == ":clear"){
      info.clearChildren();
    }else{
      info.add(line(s, false)).top().left().growX();
      info.row();
      info.add(line(Vars.mods.getScripts().runConsole(s), true)).top().left().growX();
      info.row();
    }
  }).growX().bottom().get();
}
ConsoleDialog.prototype.show = function(){
  dlg.show();
}

function CreditDialog(){
  let dlg = new BaseDialog("Mod credit");
  dlg.addCloseButton();
  dlg.cont.add("Mod by\n[#4488ff]SITUVN[]\n\nApart from sk7725/TimeControl for testing").fillX().wrap().get().setAlignment(Align.center);
}
CreditDialog.prototype.show = function(){
  dlg.show();
}

function line(s, r){
  let tbl = new Table();
  tbl.add((r ? "< " : "[lightgray]> ") + s.replace("[", "[[") + "[]").top().left().wrap().padLeft(6).growX();
  tbl.button(new TextureRegionDrawable(Icon.copy), 24, ()=>{Core.app.setClipboardText(s);}).top().padLeft(6).padRight(6);
  return tbl;
}


const con = new ConsoleDialog();
const cre = new CreditDialog();























