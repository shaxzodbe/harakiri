import React, {useEffect, useState} from "react"
import {
    Panel, Search as SearchVK,
    PanelHeader, Div, Title, Placeholder, Spinner, ModalPage,
} from "@vkontakte/vkui";
import {Icon24ChevronLeft, Icon56SearchLikeOutline} from "@vkontakte/icons";
import Comic from "../components/Comic";
import {Icon32SearchOutline} from '@vkontakte/icons';
import Helper from "../components/Helper";

const Search = ({id,search,setSearch,BACK_FROM_TIGHT,setActivePanel,tema,setActiveStory,MangaController, set_BACK_FROM_TIGHT, openTight}) => {

    const [results, setResults] = useState(null);
    const onChange = (e) => {
        setResults(null)
        if (e.target.value.length > 0)
            MangaController.searchManga({search: e.target.value}).then((r) => {
                setResults(r)
            });
        setSearch(e.target.value)
    }
    useEffect(() => {
        document.getElementById("searchBar").focus();
        if(search){
            MangaController.searchManga({search: search}).then((r) => {
                setResults(r)
            });
        }
    }, [])
    const onBack = () => {
        set_BACK_FROM_TIGHT("main");
        if (BACK_FROM_TIGHT === "reading")
            setActivePanel(BACK_FROM_TIGHT)
        else {
            setActiveStory(BACK_FROM_TIGHT)
        }


    }
    return (
        <Panel id={id}>
            <PanelHeader
                separator={false}
                left={
                    <Icon24ChevronLeft style={{marginLeft: 15}} className={Helper.getColorForTheme(tema)} onClick={onBack}/>
                }
            >
                <Title className={"nu_Extra_Bold"} level="1"
                       weight="semibold">Поиск</Title>
            </PanelHeader>
            <SearchVK id={"searchBar"} value={search} onChange={onChange}/>
            {results && results.length === 0 &&
            <Placeholder
                icon={<Icon56SearchLikeOutline fill={"#937FF5"}/>}
                header={"Упс..."}
            >
                Ничего не найдено
            </Placeholder>
            }
            {!search &&
            <Placeholder
                icon={<Icon32SearchOutline width={52} height={52} fill={"#937FF5"}/>}
                header={"Поиск"}
            >
                Начните что-то писать...
            </Placeholder>
            }
            <Div>
                {results !== null && results.length > 0 &&
                <div className="favor_list">
                    {results.map((item, key) => (
                        <Comic onClick={() => {
                            set_BACK_FROM_TIGHT("search")
                            openTight(item)
                        }} name={item.name} isNoCar={false} rating={item.sredRating}
                               img={`https://foxcomics.ru${item.avatar.substring(2).split(' ').join("%20")}`}/>
                    ))}
                </div>
                }
                {results === null && search &&
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <Spinner size="large" style={{margin: '20px 0'}}/>
                </div>
                }
            </Div>
        </Panel>
    )
}
export default Search;