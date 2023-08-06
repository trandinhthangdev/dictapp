import LogoIcon from "./assets/logo.png";
import {useState} from "react";
import WordCard from "./WordCard";

const App = (props) => {
    const [words, setWords] = useState(require('./data/data.json'))
    const [word, setWord] = useState(null)
    const [searchText, setSearchText] = useState("");
    const searchWords = searchText.trim() !== "" ? words.filter(item => item.word.toLowerCase().includes(searchText.trim().toLowerCase())).sort((a,b) => a.word.length > b.word.length ? 1 : a.word.length === b.word.length ? 0 : -1).slice(0,50) : []
    const [isFocus, setIsFocus] = useState(true);
    return (
     <div className="flex flex-col items-center bg-white h-[100vh] w-[100bw]" onClick={() => {
         setIsFocus(false)
     }}>
         <div className="bg-white text-gray-900 w-[600px] max-w-[100vw]">
             <div className="text-center h-[80px]">
                 <a className="inline-block" href={"https://trandinhthangdev.com/"} target="_blank">
                     <div className="flex flex-col items-center p-1">
                         <img className="w-[36px] h-[36px]" src={LogoIcon} />
                         <div className="text-sm font-bold">
                             Dict App
                         </div>
                         <div className="text-xs italic">@trandinhthangdev</div>
                     </div>
                 </a>
             </div>
             <div className="h-[60px] px-4">
                 <div className="relative">
                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                         <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                         </svg>
                     </div>
                     <input autoFocus onClick={(event) =>{
                            event.stopPropagation()
                         setIsFocus(true)
                     }} type="search" id="default-search" value={searchText} onChange={event => {
                         setSearchText(event.target.value)
                     }} className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-0" placeholder="Search voca ..." required />
                 </div>
             </div>
             {searchWords.length > 0 && isFocus && <div className="fixed shadow-2xl top-[140px] p-2 overflow-y-auto w-[600px] max-w-[100vw] bg-white" style={{
                 maxHeight: 'calc(100vh - 300px)'
             }}>
                 {
                     searchWords.map(item => {
                         return (
                             <div
                                 onClick={() => {
                                 setWord(item)
                                     setIsFocus(false)
                                     setSearchText(item.word)
                             }}
                                 className="text-md p-1 hover:text-blue-800 hover:font-bold cursor-pointer"><span className="text-sm mr-2">({item.type})</span>{item.word}</div>
                         )
                     })
                 }
             </div>}
             {word && <WordCard id={word.id} />}
         </div>
     </div>
  );
};

export default App;
