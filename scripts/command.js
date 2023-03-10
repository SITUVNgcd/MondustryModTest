let wloaded = false;
Events.on(WorldLoadEvent, () => {
  if(wloaded){
    return;
  }
  try{
    let input = Vars.control.input;
    let hg = Vars.ui.hudGroup;
    if(Vars.mobile){ // Mobile
      let cmd = findCommandButton();
      let par = cmd.parent;
      //cmd.getLabel().setWrap(false);
      cmd.getLabelCell().padLeft(6);
      cmd.pack();
      par.clear();
      par.add(cmd);
      
      hg["fill(arc.func.Cons)"](cont=>{
        cont.touchable = Touchable.childrenOnly;
        cont.bottom().left();
        cont.name = "command.js";
        let assC = cont["table(arc.scene.style.Drawable)"](Styles.black5).height(50).padLeft(0);
        let ass = assC.get();
        let alu = ass.button(Icon.units, ()=>{
          
        });
        
        cont.row();
        let cmxC = cont["table(arc.scene.style.Drawable)"](Styles.black5).height(55).padLeft(155);
        let cmx = cmxC.get();
        cmx.visibility = ()=>input.commandMode;
        let stt = 0;
        let add = cmx.button(Icon.add, ()=>{
          if(stt != 1){
            stt = 1
          }else{
            stt = 0;
          }
        }).padLeft(6).growY().center().get();
        add.setProgrammaticChangeEvents(false);
        let addS = add.getStyle();
        addS.imageCheckedColor = Color.valueOf("4488ff");
        add.setStyle(addS);
        
        let rem = cmx.button(Icon.trash, ()=>{
          if(stt != -1 && !input.selectedUnits.isEmpty()){
            stt = -1
          }else{
            stt = 0;
          }
        }).padLeft(6).growY().center().get();
        rem.setProgrammaticChangeEvents(false);
        let remS = rem.getStyle();
        remS.imageCheckedColor = Color.valueOf("ff4488");
        rem.setStyle(remS);
        
        let can = cmx.button(Icon.cancel, ()=>{
          input.selectedUnits.clear();
          let pstt = stt;
          if(stt != 0){
            stt = 0;
          }
          Events.fire(Trigger.unitCommandChange);
          if(pstt == 1){
            stt = 1;
          }
        }).padLeft(6).growY().center().get();
        can.setProgrammaticChangeEvents(false);
        can["setDisabled(arc.func.Boolp)"](()=>input.selectedUnits.isEmpty());
        
        cmx.update(()=>{
          cmxC.padLeft(cmd.width).height(cmd.height);
          if(!cmd.isChecked()){
            stt = 0;
          }
          add.setChecked(stt == 1);
          rem.setChecked(stt == -1);
        });
        let tmpuns, evt = false;
        Events.run(Trigger.unitCommandChange, ()=>{
          try{
            if(tmpuns && !evt && stt != 0){
              evt = true;
              let uns = input.selectedUnits.list();
              let i, idx;
              if(stt == 1){
                tmpuns["addAll(java.util.Collection)"](uns);
              }else if(stt == -1){
                tmpuns["removeAll(java.util.Collection)"](uns);
                if(tmpuns.size() == 0){
                  stt = 0;
                }
              }
              input.selectedUnits.clear();
              input.selectedUnits["addAll(java.lang.Iterable)"](tmpuns);
              Events.fire(Trigger.unitCommandChange);
              evt = false;
            }
            tmpuns = input.selectedUnits.list();
          }catch(e){
            Log.info(e);
          }
        });
      });
    }else{ // Desktop
      
    }
  }catch(e){
    Log.info(e);
  }
  wloaded = true;
});

function findCommandGroup(){
  let hg = Vars.ui.hudGroup;
  return hg["find(arc.func.Boolf)"](e=>{
    let cc, cm;
    let [bd, cf] = [Core.bundle, "get(java.lang.String,java.lang.String)"];
    let [cct, cmt] = [bd[cf]("command", "Command"), bd[cf]("cancel", "Cancel")];
    if(e instanceof WidgetGroup){
      e.forEach(f=>{
        if(f.getText){
          if(f.getText() == cct){
            cc = f;
          }
          if(f.getText() == cmt){
            cm = f;
          }
        }
      });
    }
    return cc != null && cm != null;
  });
}

function findCommandButton(){
  let hg = Vars.ui.hudGroup;
  return hg["find(arc.func.Boolf)"](e=>{
    let [bd, cf] = [Core.bundle, "get(java.lang.String,java.lang.String)"];
    let cct = bd[cf]("command", "Command");
    return e instanceof TextButton && e.getText() == cct;
  });
}

function findParent(c){
  if(!c){
    return null;
  }
  let hg = Vars.ui.hudGroup;
  return hg["find(arc.func.Boolf)"](e=>{
    let cc = null;
    e.forEach(f=>{
      if(f == c){
        cc = f;
      }
    });
    return c == cc;
  });
}