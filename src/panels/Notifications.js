import React, {useEffect, useState} from "react";
import {
    Panel, PanelHeader, Div, Cell, Switch, Subhead, Group, Title, Placeholder
} from "@vkontakte/vkui";
import {Icon28Search, Icon32SearchOutline} from "@vkontakte/icons";
import Updates from "../components/Updates";


const Notifications = ({id, MangaController, bridge, UserController, fetchedUser, setActiveStory, set_BACK_FROM_TIGHT, openTight, setAlerts, alerts}) => {
    const getTimeWhen = (date) => {
        date = new Date(date)
        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) + " лет назад";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " месяцев назад";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " дней назад";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " часов назад";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " минут назад";
        }
        if (Math.floor(seconds) <= 0)
            return "только что";
        else
            return Math.floor(seconds) + " секунд назад";


    }
    const [alerts_all, setAlertsAll] = useState(null)
    const [checked, setChecked] = useState(false)
    useEffect(() => {
        MangaController.getAlerts({read: true}).then((r) => {
            setAlertsAll(r)
            MangaController.getAlerts({}).then((r) => {
                setAlerts(r)
            })

        })
        let alertsss = alerts;
        setChecked(fetchedUser && fetchedUser.notif_to_mess)
    }, [])
    const openSome = (item) => {
        set_BACK_FROM_TIGHT("notif")
        openTight(item.manga)
    }
    return (
        <Panel id={id}>
            <PanelHeader
                left={<Icon28Search onClick={() => setActiveStory("search")} className="ztc" style={{marginLeft: 5}}/>}
                separator={false}
            />
            <Div>
                <Cell disabled after={<Switch checked={checked} onChange={(e) => {
                    let j = Boolean(e.currentTarget.checked);
                    if (j)
                        bridge.send("VKWebAppAllowMessagesFromGroup", {"group_id": 201782874}).then((res) => {
                            UserController.setAllowMes({allow: res.result}).then(() => {
                                setChecked(res.result)
                            })
                        }).catch(()=>{
                            UserController.setAllowMes({allow: false}).then(() => {
                                setChecked(false)
                            })
                        });
                    else
                        UserController.setAllowMes({allow: j}).then(() => {
                            setChecked(j)
                        })

                }}/>}>
                    <Subhead weight="regular" className={"nu_Bold"}>Уведомления в личные сообщения</Subhead>
                </Cell>
            </Div>
            <Group header={
                <Title className={"nu_Bold"} style={{padding: 10}} level="2" weight="regular">Вышла новая глава</Title>
            }>
                {alerts_all && alerts_all.length > 0 ? alerts_all.map((item, key) => (
                        <div className={`update_notif ${!item.readed && "activeMMM"}`}>
                            <Updates onClick={() => openSome(item)}
                                     img={`https://foxcomics.ru${item.manga.avatar.substring(2).split(' ').join("%20")}`}
                                     name={item.manga.name}
                                     time={getTimeWhen(item.when_created)}
                                     tom={`Том ${item.manga.glavs.length} 
                                     ${item.manga.hasOwnProperty("text") && item.manga.text ? '' :
                                         `| Глава ${item.manga.glavs[item.manga.glavs.length - 1].series.length}`}`}/>

                        </div>
                    ))
                    :
                    <Placeholder
                        icon={<Icon32SearchOutline width={52} height={52} fill={"#937FF5"}/>}
                        header={"Поиск"}
                    >
                        Пока тут ничего нет...
                    </Placeholder>

                }
                {/* <Div>
                    <div className="right_data">
                        <Subhead weight="regular" style={{color: "#99A2AD"}}
                                 className={"nu_Semi_Bold v1"}>Сегодня</Subhead>
                    </div>
                </Div>

                <div className="update_notif">
                    <Updates img={"https://fast-anime.ru/shop/upload/231891.jpg"} name={"Your Lie in April"}
                             time={"2 часа назад"} tom={"Том 1 | Глава 2"}/>
                    <Updates
                        img={"https://static.mangajar.com/pages/2303/183004/aRzXG4NHKWWsEimG0eoliFRk2wjemR2Y50g2MoV2.jpg"}
                        name={"Hajimari no Niina Niina Niina"} time={"5 часов назад"}
                        tom={"Том 2 | Глава 122"}/>
                </div>
                <Div>
                    <div className="right_data">
                        <Subhead weight="regular" style={{color: "#99A2AD"}}
                                 className={"nu_Semi_Bold v1"}>12.02.2020</Subhead>
                    </div>
                </Div>

                <div className="update_notif">
                    <Updates img={"https://fast-anime.ru/shop/upload/231891.jpg"} name={"Your Lie in April"}
                             time={"2 часа назад"} tom={"Том 1 | Глава 2"}/>
                    <Updates
                        img={"https://static.mangajar.com/pages/2303/183004/aRzXG4NHKWWsEimG0eoliFRk2wjemR2Y50g2MoV2.jpg"}
                        name={"Hajimari no Niina Niina Niina"} time={"5 часов назад"}
                        tom={"Том 2 | Глава 122"}/>
                </div>*/}
            </Group>
        </Panel>
    )
}

export default Notifications;