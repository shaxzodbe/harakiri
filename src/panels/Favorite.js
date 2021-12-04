import React, {useEffect, useState} from "react";
import {

    Panel, PanelHeader, Div, Placeholder, Subhead, HorizontalScroll, Group

} from "@vkontakte/vkui";
import {Icon28Search} from "@vkontakte/icons";
import Comic from "../components/Comic";
import { Icon56SearchLikeOutline } from '@vkontakte/icons';

const Favorite = ({id,BACK_FROM_TIGHT,setActiveStory,set_BACK_FROM_TIGHT,UserController,openTight}) => {
    const [activeScreen, setActive] = useState(0);
    const [favorList,setFavorList] = useState(null)
    const screens = [
        "Понравилось",
        "Рецензии",
        "Читаю",
        "В планах",
        "Прочитано",
        "Отложено",
        "Брошено",
        "Без группы",
    ]
    useEffect(()=>{
        UserController.getMyFavorites({}).then((res)=>{
            setFavorList(res)
        })
    },[])
    return (
        <Panel id={id}>
            <PanelHeader

                left={<Icon28Search onClick={()=>setActiveStory("search")} className="ztc" style={{marginLeft:5}} />}
                separator={false}
            />
            <Div>
                <HorizontalScroll showArrows={false}>
                    <div className="favor_buttons">
                        <div onClick={() => setActive(0)} className={`favor_button ${activeScreen === 0 && `active`}`}>
                            <Subhead className="nu_Regular" level={3}
                            >Понравилось</Subhead>
                        </div>
                        <div onClick={() => setActive(1)} className={`favor_button ${activeScreen === 1 && `active`}`}>
                            <Subhead className="nu_Regular" level={3}
                            >Рецензии</Subhead>
                        </div>
                        <div onClick={() => setActive(2)} className={`favor_button ${activeScreen === 2 && `active`}`}>
                            <Subhead className="nu_Regular" level={3}
                            >Читаю</Subhead>
                        </div>
                        <div onClick={() => setActive(3)} className={`favor_button ${activeScreen === 3 && `active`}`}>
                            <Subhead className="nu_Regular" level={3}
                            >В планах</Subhead>
                        </div>
                        <div onClick={() => setActive(4)} className={`favor_button ${activeScreen === 4 && `active`}`}>
                            <Subhead className="nu_Regular" level={3}
                            >Прочитано</Subhead>
                        </div>
                        <div onClick={() => setActive(5)} className={`favor_button ${activeScreen === 5 && `active`}`}>
                            <Subhead className="nu_Regular" level={3}
                            >Отложено</Subhead>
                        </div>
                        <div onClick={() => setActive(6)} className={`favor_button ${activeScreen === 6 && `active`}`}>
                            <Subhead className="nu_Regular" level={3}
                            >Брошено</Subhead>
                        </div>
                        <div onClick={() => setActive(7)} className={`favor_button ${activeScreen === 7 && `active`}`}>
                            <Subhead className="nu_Regular" level={3}
                            >Без группы</Subhead>
                        </div>



                    </div>
                </HorizontalScroll>

            </Div>
            {(!favorList || favorList[activeScreen].length === 0) &&
                <Group>
                    <Placeholder
                        icon={<Icon56SearchLikeOutline fill={"#937FF5"} />}
                        header={screens[activeScreen]}
                    >
                        Ничего не найдено
                    </Placeholder>
                </Group>
            }
            {favorList && favorList[activeScreen].length > 0 &&
            <div className="favor_list">
                {favorList[activeScreen].map((item,key)=>(
                    <Comic onClick={() => {
                        set_BACK_FROM_TIGHT("favor")
                        openTight(item)
                    }} name={item.name} isNoCar={false} rating={item.sredRating}
                           img={`https://foxcomics.ru${item.avatar.substring(2).split(' ').join("%20")}`} />
                ))}
            </div>
            }




        </Panel>
    )
}

export default Favorite;