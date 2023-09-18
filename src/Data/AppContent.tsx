import * as React from 'react';
import * as Tone from 'tone';
import { tabType, note, instrumentName, scaleName, effectType, promptTypes } from './@types/types';
import { AppContextType } from './@types/contextType';
import { newTab } from './TabGeneration/TabGeneration';
import { instrumentProperty } from './Music/Instruments';
import LoadData from './SaveLoad/LoadData';

interface Props {
    children : React.ReactNode;
}
type promptInfo = {
    notePrompt : {
        tabIndex : number,
        noteIndex : number,
        instrument : instrumentProperty
    },
    savePrompt : {
        tab : tabType,
        // effect : effectType
        effect : {
            data : effectType,
            mode : 'new' | 'replace' 
        }
    }
}


export const AppContext = React.createContext<AppContextType | null>(null);

const AppContextProvider: React.FC<Props> = ({children}) =>{
    const [tabIndex,setTabIndex] = React.useState<number>(3);
    const [effectIndex,setEffectIndex] = React.useState<number>(5);
    const [tabs,setTabs] = React.useState<tabType[]>([
        {
            title:'For whom the bell tolls intro - bass',
            index:0,
            tab:[
                {note:'34',length:'8n'},
                {note:'33',length:'8n'},
                {note:'32',length:'8n'},
                {note:'31',length:'2n'},
                {note:'27',length:'8n'},
                {note:'26',length:'8n'},
                {note:'34',length:'8n'},
                {note:'22',length:'8n'},
                {note:'21',length:'2n'},
            ],
            scale:'aeolian',
            instrumentName : 'bass',
            tempo:120,
            change:false,
        },
        {
            title:'Dueling Banjos',
            index:1,
            tab:[
                {note:'15',length:'16n'},
                {note:'15',length:'16n'},
                {note:'15',length:'16n'},
                {note:'17',length:'8n'},
                {note:'19',length:'8n'},
                {note:'20',length:'8n'},
                {note:'22',length:'8n'},
                {note:'20',length:'8n'},
                {note:'19',length:'4n'},
                // {note:'24',length:'4n'},
            ],
            scale:'aeolian',
            instrumentName : 'guitar',
            tempo:120,
            change:false,
        },
        {
            title:'Jasmine',
            index:2,
            tab:[
                {note:'0',length:'8n'},
                {note:'5',length:'8n'},
                {note:'10',length:'8n'},
                {note:'15',length:'8n'},
                {note:'19',length:'8n'},
                {note:'24',length:'8n'},
                {note:'13',length:'8n'},
            ],
            scale:'aeolian',
            instrumentName : 'guitar',
            tempo:120,
            change:false,
        },
    ])
    const [effects,setEffects] = React.useState<effectType[]>([
        {
            index : 0,
            title: 'New Effect',
            distortion:{
                active : false,value : [0],type:"distortion"
            },
            reverb: {
                active : false,value : [0],type:"reverb"
            },
            tremolo: {
                active : false,value : [0],type:"tremolo"
            },
            eq: {
                active : false,value : [0],type:"eq"
            },
        },
        {
            index : 1,
            title: 'Add Effect',
            distortion:{
                active : false,value : [0],type:"distortion"
            },
            reverb: {
                active : false,value : [0],type:"reverb"
            },
            tremolo: {
                active : false,value : [0],type:"tremolo"
            },
            eq: {
                active : false,value : [0],type:"eq"
            },
        },
        {
            index : 2,
            title: 'distortion',
            distortion:{
                active : true,value : [0.5],type:"distortion"
            },
            reverb: {
                active : false,value : [0.3,0.7],type:"reverb"
            },
            tremolo: {
                active : false,value : [0.3],type:"tremolo"
            },
            eq: {
                active : false,value : [0.3],type:"eq"
            },
        },
        {
            index : 3,
            title: 'reverb',
            distortion:{
                active : false,value : [0.8],type:"distortion"
            },
            reverb: {
                active : true,value : [0.6,0.8],type:"reverb"
            },
            tremolo: {
                active : false,value : [0.1],type:"tremolo"
            },
            eq: {
                active : false,value : [0.3],type:"eq"
            },
        },
        {
            index : 4,
            title: 'tremolo',
            distortion:{
                active : false,value : [0.8],type:"distortion"
            },
            reverb: {
                active : false,value : [0.6],type:"reverb"
            },
            tremolo: {
                active : true,value : [9,0.7],type:"tremolo"
            },
            eq: {
                active : false,value : [0.3],type:"eq"
            },
        },
        {
            index : 5,
            title: 'crusher',
            distortion:{
                active : false,value : [0.8],type:"distortion"
            },
            reverb: {
                active : false,value : [0.6],type:"reverb"
            },
            tremolo: {
                active : false,value : [9,0.75],type:"tremolo"
            },
            eq: {
                active : true,value : [0.3],type:"eq"
            },
        },

    ])
    const [activePrompt,setActivePrompt] = React.useState<promptTypes>(null);
    const [promptInfo,setPromptInfo] = React.useState<promptInfo>({
        notePrompt : {
            instrument : 'bass',
            tabIndex : -1,
            noteIndex: -1
        },
        savePrompt : {
            tab : {
                title: 'not set',
                index:-1,
                tab : [],
                scale : 'aeolian',
                instrumentName:'bass',
                tempo: -1,
                change: false,
            },
            effect : {
                mode : 'new',
                data : {
                    index : -1,
                    title: 'testing yo',
                    distortion:{
                        active : false,value : [0],type:"distortion"
                    },
                    reverb: {
                        active : false,value : [0,0],type:"reverb"
                    },
                    tremolo: {
                        active : false,value : [0,0],type:"tremolo"
                    },
                    eq: {
                        active : false,value : [0,0,0],type:"eq"
                    },
                }
            },
        }
    })
    
    const getTabs = {
        single:{
            full : (tabIndex:number)=>{
                // Returns all of the single tab info
                let tabOut = {...tabs[0]};
                for (let i = 0; i < tabs.length;i++){
                    if (tabs[i].index === tabIndex) {
                        tabOut = {...tabs[i]}
                        i = tabs.length;
                    }
                }
                return tabOut;
            },
            arrIndex : (tabIndex:number)=>{
                let out = -1;
                for (let i = 0; i < tabs.length; i++){
                    if (tabs[i].index === tabIndex){
                        out = i; 
                        i = tabs.length;
                    } 
                }
                return out;
            },
            note : (tabIndex:number,noteIndex:number):note=>{
                const tab = getTabs.single.full(tabIndex);
                return tab.tab[noteIndex];
            }
        }
    }
    const changeTabs = {
        singleNote : {
            change : (tabIndex:number,noteIndex:number,changeValue:note)=>{
                const index = getTabs.single.arrIndex(tabIndex);
                const tabsNew = [...tabs];
                tabsNew[index].tab[noteIndex] = changeValue;
                tabsNew[index].change = !tabsNew[index].change;
                setTabs(tabsNew);
            },
            add : (tabIndex:number,newValue:note)=>{
                const index = getTabs.single.arrIndex(tabIndex);
                const tabsNew = [...tabs];
                tabsNew[index].tab.push(newValue);
                tabsNew[index].change = !tabsNew[index].change;
                setTabs(tabsNew);
            },
            remove :(tabIndex:number)=>{
                const index = getTabs.single.arrIndex(tabIndex);
                const tabsNew = [...tabs];
                tabsNew[index].tab.pop();
                tabsNew[index].change = !tabsNew[index].change;
                setTabs(tabsNew);
            }
        },
        instrument : (tabIndex:number,instrumentName : instrumentName)=>{
            const index = getTabs.single.arrIndex(tabIndex);
            const tabsNew = [...tabs];
            tabsNew[index].instrumentName = instrumentName;
            tabsNew[index].change = !tabsNew[index].change;
            setTabs(tabsNew);
        },
        create : (title:string,scale:scaleName,instrument:instrumentName,length:number,rootNote:number,octave:number,noteLengths:boolean[],deadNoteChance:number)=>{
            const tabOut : tabType = {
                tab : newTab(scale,length,rootNote,octave,noteLengths,deadNoteChance),
                index : tabIndex,
                title:title,
                scale : scale,
                instrumentName: instrument,
                change : false,
                tempo:120,
            }
            setTabIndex(tabOut.index+1);
            const tabsNew = [...tabs];
            tabsNew.push(tabOut);
            setTabs(tabsNew);
        },
        add : (tab:tabType)=>{
            // Handle the index here I think
            tab.index = tabIndex
            setTabIndex(tab.index+1);
            const tabsNew = [...tabs];
            tabsNew.push(tab);
            setTabs(tabsNew);
        },
        remove : (tabIndex:number)=>{
            let tabsNew = [...tabs];
            tabsNew = tabsNew.filter(item => {
                item.change = !item.change;
                return item.index !== tabIndex
            });
            setTabs(tabsNew);
        },
        changeTitle : (tabIndex:number,title:string)=>{
            const index = getTabs.single.arrIndex(tabIndex);
            const tabsNew = [...tabs];
            tabsNew[index].title = title;
            tabsNew[index].change = !tabsNew[index].change;
            setTabs(tabsNew);
        },
        changeTempo : (tabIndex:number,tempo:number)=>{
            const index = getTabs.single.arrIndex(tabIndex);
            const tabsNew = [...tabs];
            tabsNew[index].tempo = tempo;
            tabsNew[index].change = !tabsNew[index].change;
            setTabs(tabsNew);
        },

    }
    const getEffects = {
        single : {
            byIndex : (index:number)=>{
                let out = effects[0];
                effects.forEach(effect=>{
                    if (effect.index === index) out = effect;
                })
                return out;
            },
            byTitle : (title:string)=>{
                let out = effects[0];
                effects.forEach(effect=>{
                    if (effect.title === title) out = effect;
                })
                return out;
            },
            toTone : (title:string)=>{
                const info = getEffects.single.byTitle(title);
                const out = [];
                // const dist = info.distortion;const rev = info.reverb;
                const {distortion,reverb,tremolo,eq} = info;
                // Tried to do this externally but the returned Tone obj still needed to be called here so it didn't really save anything
                if (distortion.active === true){
                    out.push(new Tone.Distortion(distortion.value[0]).toDestination());
                }
                if (reverb.active === true){
                    const JCReverb = new Tone.JCReverb(reverb.value[0]).toDestination();
                    const delay = new Tone.FeedbackDelay(reverb.value[1]);
                    out.push(JCReverb,delay);
                }
                if (tremolo.active === true){
                    out.push(new Tone.Tremolo(tremolo.value[0],tremolo.value[1]).toDestination().start());
                }
                if (eq.active === true){
                    out.push(new Tone.EQ3(0,2,0).toDestination())
                }
                return out;
            }
        },
        all :{
            title  : () => {
                const out : string[] = [];
                effects.forEach(effect=>out.push(effect.title));
                return out;
            }
        }
    }
    const changeEffects = {
        add : (input:effectType)=>{
            const effectNew = input;
            effectNew.index = effectIndex;
            setEffects([...effects,effectNew]);
            setEffectIndex(effectIndex+1);
        },
        remove : (effectIndex:number)=>{
            let effectsNew = [...effects];
            effectsNew = effectsNew.filter(item => {
                // item.change = !item.change;
                return item.index !== effectIndex
            });
            setEffects(effectsNew);
        },
        replace : (effectIn:effectType)=>{
            // const out = [];
            const out = [...effects];
            effects.forEach((item,ind)=>{
                if (item.index === effectIn.index) out[ind] = effectIn; 
                // item.index !== index ? out.push(item) : out.push(effectIn);
            })
            setEffects(out);
        }
        
    }
    const getPrompts = {
        active : activePrompt,
        newNote : ()=>{
            const {tabIndex,noteIndex,instrument} = promptInfo.notePrompt;
            const noteValue = getTabs.single.note(tabIndex,noteIndex);
            return {tabIndex,noteIndex,noteValue,instrument};
        },
        saveInfo : {
            tabInfo : promptInfo.savePrompt.tab,
            effectInfo : promptInfo.savePrompt.effect
        }
    }
    const changePrompts = {
        set:{
            newNote : {
                simple : (tabIndex:number,noteIndex:number,instrument:instrumentProperty)=>{
                    const promptInfoNew = {...promptInfo};
                    promptInfoNew.notePrompt = {tabIndex,noteIndex,instrument};
                    setPromptInfo(promptInfoNew);
                    setActivePrompt('newNoteSimple');
                },
                fretboard : (tabIndex:number,noteIndex:number,instrument:instrumentProperty)=>{
                    const promptInfoNew = {...promptInfo};
                    promptInfoNew.notePrompt = {tabIndex,noteIndex,instrument};
                    setPromptInfo(promptInfoNew);
                    setActivePrompt('newNoteFretboard');
                },
            },
            save :{
                tab : (tabIndex:number)=>{
                    const promptInfoNew = {...promptInfo};
                    promptInfoNew.savePrompt.tab = getTabs.single.full(tabIndex);
                    setPromptInfo(promptInfoNew);
                    setActivePrompt('saveTab')
                },
                effect : {
                    byIndex : (effectIndex:number)=>{
                        const effect = getEffects.single.byIndex(effectIndex);
                        changePrompts.set.save.effect.byInput(effect);
                        // console.error("function hasn't been made yet");
                    },
                    byInput : (effectIn:effectType)=>{
                        const promptInfoNew = {...promptInfo};
                        promptInfoNew.savePrompt.effect.data = effectIn;
                        setPromptInfo(promptInfoNew);
                        setActivePrompt('saveEffect');
                    },
                    reset: ()=>{
                        const promptInfoNew = {...promptInfo};
                        promptInfoNew.savePrompt.effect.data = {
                            index : -1,
                            title: 'testing yo',
                            distortion:{
                                active : false,value : [0],type:"distortion"
                            },
                            reverb: {
                                active : false,value : [0,0],type:"reverb"
                            },
                            tremolo: {
                                active : false,value : [0,0],type:"tremolo"
                            },
                            eq: {
                                active : false,value : [0,0,0],type:"eq"
                            },
                        }
                        setPromptInfo(promptInfoNew);
                    },
                    changeMode : (mode : 'new' | 'replace' )=>{
                        const promptInfoNew = {...promptInfo};
                        promptInfoNew.savePrompt.effect.mode = mode;
                        setPromptInfo(promptInfoNew);
                    }
                }
            },
            load : {
                tab : ()=>{setActivePrompt('loadTab')},
                effect : ()=>{setActivePrompt('loadEffect')},
            },
            effect : (mode:'new' | 'replace')=>{
                changePrompts.set.save.effect.changeMode(mode);
                setActivePrompt('newEffect');
            },
            tab : ()=>{setActivePrompt('newTab')}
        },

        close: {
            standard : ()=>{setActivePrompt(null)},
            loadPrompt : (key : string)=>{
                const tab = LoadData.localStorage.tab.loadSingle(key);
                if (tab === null) return console.error(`${tab} wasn't found lulz`);
                
                changeTabs.add(promptInfo.savePrompt.tab);
                setActivePrompt(null);
            }
        }
    }
    return (
        <AppContext.Provider value={{tabs,getTabs,changeTabs,effects,getEffects,changeEffects,changePrompts,getPrompts}}>
            {children}
        </AppContext.Provider>
    )
}
export const TabDefault = {
    
    title:'default1',
    index:0,
    tab:[
        {note:'1',length:'16'},
        {note:'6',length:'16'},
        {note:'11',length:'16'},
        {note:'15',length:'16'},
    ],
    scale:'notSet'
}

export default AppContextProvider;