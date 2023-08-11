import * as Tone from 'tone';
import {synthType, synthName } from '../../../@types/types';
import BassSample1 from './Samples/BassSample1';
import BassSample2 from './Samples/BassSample2';
import GuitarSample1 from './Samples/GuitarSample1';
import PianoSample from './Samples/PianoSample1';
import BanjoSample1 from './Samples/BanjoSample1';
import CrashWoahSample from './Samples/CrashWoahSample1';


type SynthProps = {
    synths : synthType[],
    getSynth : (title:synthName)=>synthType,
    getAllNames : ()=>string[]
}
const Synths:SynthProps = {
    synths : [],
    getSynth : (title:synthName):synthType=>{
        const synthArr = Synths.synths;
        let out = synthArr[0];
        for (let i = 0; i < synthArr.length; i++){
            if (synthArr[i].title === title) {
                out = Synths.synths[i];
                i = synthArr.length;
            }
        }
        return out;
    },
    getAllNames : ()=>{
        const out :string[] = [];
        Synths.synths.forEach(synth=>{
            out.push(synth.title);
        })
        return out;
    }
}
class Synth {
    title : synthName;
    synth : any;
    constructor (title:synthName,synth:any){
        this.title = title;
        this.synth = synth;
        Synths.synths.push(this);
    }
}
new Synth ("Synth",new Tone.Synth().toDestination());
new Synth ("Duo",new Tone.DuoSynth().toDestination());
new Synth ("FMSynth",new Tone.FMSynth().toDestination());
new Synth ("AMSynth",new Tone.AMSynth().toDestination());
new Synth ("MembraneSynth",new Tone.MembraneSynth().toDestination());
new Synth ("MetalSynth",new Tone.MetalSynth().toDestination());
new Synth ("MonoSynth",new Tone.MonoSynth().toDestination());
new Synth ("PluckSynth",new Tone.PluckSynth().toDestination());
new Synth (BassSample1.title,BassSample1.synth);
new Synth (BassSample2.title,BassSample2.synth);
new Synth (GuitarSample1.title,GuitarSample1.synth);
new Synth (PianoSample.title,PianoSample.synth);
new Synth (BanjoSample1.title,BanjoSample1.synth);
new Synth (CrashWoahSample.title,CrashWoahSample.synth);

export default Synths