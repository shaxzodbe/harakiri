import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button, CellButton,
    Div, Gallery, Group, Header, HorizontalCell,
    HorizontalScroll,
    Panel,
    PanelHeader,
    Separator,
    Subhead,
    Tabs,
    TabsItem,
    Title, View
} from "@vkontakte/vkui";
import {
    Icon16ViewOutline, Icon20HideOutline, Icon20Like, Icon20LikeOutline, Icon20ViewOutline,
    Icon24ChevronLeft, Icon24ClockOutline, Icon28ChevronDownOutline, Icon28ChevronUpOutline,
    Icon28DoneOutline,
    Icon28Notifications, Icon28Search,
    Icon28ShareOutline
} from "@vkontakte/icons";
import {Carousel} from "react-responsive-carousel";
import Comic from "../components/Comic";
import {Icon24DoneOutline} from '@vkontakte/icons';
import {Icon24LockOutline} from '@vkontakte/icons';
import Helper from "../components/Helper";

const Customize = ({id, tema, setTheme, bridge, updateUser, setUser, UserController, fetchedUser, go}) => {
    const [vneshka, setVneshka] = useState(0);
    const [bought, setBought] = useState(null)
    const [activeObvod, setActiveObvod] = useState(null)
    const onBack = () => {
    }
    const setBorderAvatar = (id) => {
        if (fetchedUser.hasOwnProperty("balls")) {
            if (id === 1 && fetchedUser.balls < 20)
                return false;
            if (id === 2 && fetchedUser.balls < 250)
                return false;
            if (id === 3 && fetchedUser.balls < 500)
                return false;
            let u = fetchedUser;
            u.avatar_border = id;
            setUser({...u})
            UserController.setBorderAvatar(id);
        }

    }
    useEffect(() => {
        UserController.findProfile(fetchedUser).then((r) => {
            if (r.works.length > 0) {
                let k = r.works[0].creators.find(e => e.id === r._id);
                if (k && k.role.toLowerCase() === "сценарист") {
                    setActiveObvod(7)
                } else if (k && k.role.toLowerCase() === "тайпер") {
                    setActiveObvod(8)
                } else if (k && k.role.toLowerCase() === "художник" || k.role.toLowerCase() === "Фоновик" || k.role.toLowerCase() === "Комиксист"
                    || k.role.toLowerCase() === "Колорист") {
                    setActiveObvod(9)
                }

            }
            setUser(r)
        })
    }, [])
    useEffect(() => {

        if (fetchedUser) {
            if (fetchedUser.hasOwnProperty("bought"))
                setBought(fetchedUser.bought)
            else setBought([])
        }
    }, [fetchedUser])

    return (
        <Panel id={id}>
            <PanelHeader
                style={{padding: 10, paddingBottom: 0}}
                left={<Icon24ChevronLeft style={{marginLeft: 15}} className={Helper.getColorForTheme(tema)} onClick={go}
                                         data-to={"settings"}/>}
                separator={false} shadow={false}
                className={"x"}
            > <Title className="tight_title setting_headers nu_Extra_Bold"
                     level={2}>Внешний вид</Title></PanelHeader>
            <div className="vip_back_image" style={{
                backgroundImage: `url(background-image: url(https://annahelp.ru/wp-content/uploads/2021/05/c3aad58856f1369.jpg);
    background-position: center;)`
            }}/>
            <Div>
                {/*<Group  separator={"hide"}

                        header={<Header className={"nu_Semi_Bold"}>Внешнее оформление</Header>}>
                    <Gallery className="sjsjsj" slideWidth="20%" style={{height: 80}}>
                        <div style={{width: 50}}>
                            <CellButton onClick={() => setVneshka(0)} before={vneshka === 0 &&
                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/>} mode={"tertiary"}
                                        className={"vnesh_block ofor_purpl"} expandable={false}/>
                        </div>
                        <div style={{width: 50}}>
                            <CellButton onClick={() => setVneshka(1)} before={vneshka === 1 &&
                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/>}
                                        className={"vnesh_block ofor_red"} expandable={false}/>
                        </div>
                        <div style={{width: 50}}>
                            <CellButton onClick={() => setVneshka(2)} before={vneshka === 2 &&
                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/>}
                                        className={"vnesh_block ofor_yellow"} expandable={false}/>
                        </div>
                        <div style={{width: 50}}>
                            <CellButton onClick={() => setVneshka(3)} before={vneshka === 3 &&
                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/>}
                                        className={"vnesh_block ofor_blue"} expandable={false}/>
                        </div>
                        <div style={{width: 50}}>
                            <CellButton onClick={() => setVneshka(4)} before={vneshka === 4 &&
                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/>}
                                        className={"vnesh_block ofor_pink"} expandable={false}/>
                        </div>
                    </Gallery>

                </Group>*/}
                <Group header={<Header className={"nu_Semi_Bold"}>Фон</Header>}>

                    <div className="vneshnee_look" style={{justifyContent: "space-around"}}>
                        <div onClick={() => {
                            setTheme("space_gray")
                        }} className="fon_block">
                            <div className="background_fon black_th">
                                {tema === "space_gray" &&
                                <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/>}
                            </div>

                            <Title style={{marginTop: 10}} className="nu_Bold"
                                   level={3}>Тёмная</Title>
                        </div>
                        <div
                            onClick={() => {
                                setTheme("bright_light")
                            }}
                            className="fon_block">
                            <div className="background_fon white_th">
                                {tema === "bright_light" &&
                                <Icon24DoneOutline className={"done_vneshka"} fill={"rgb(147,127,245)"}/>}
                            </div>

                            <Title style={{marginTop: 10}} className="nu_Bold"
                                   level={3}>Светлая</Title>
                        </div>
                        {/*<div className="fon_block">
                            <div className="background_fon orange_green_gradient">
                                {tema === 2 &&
                                <Icon24DoneOutline className={"done_vneshka"} fill={"rgb(147,127,245)"}/>}
                                <Title style={{marginTop: 10, color: "white"}} className="nu_Bold"
                                       level={3}>VIP</Title>
                            </div>

                            <Title style={{marginTop: 10}} className="nu_Bold"
                                   level={3}>Своя тема</Title>
                        </div>*/}
                    </div>

                </Group>
                <Group header={<Header className={"nu_Semi_Bold"}>Ранговые обводки</Header>}>
                    <Gallery className="sjsjsj" slideWidth="30%" style={{height: 100}}>
                        <div onClick={() => setBorderAvatar(0)} style={{width: 100}}>
                            <div className="rang_block_outer">
                                <div className="rang_block gray_r">
                                    <div className="rang_inner">
                                        {!fetchedUser.hasOwnProperty("avatar_border") || fetchedUser.avatar_border === 0 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }

                                    </div>
                                </div>
                                <Title style={{marginTop: 10}} className="nu_Bold"
                                       level={3}>Ранг 1</Title>
                            </div>
                        </div>
                        <div onClick={() => setBorderAvatar(1)} style={{width: 100}}>
                            <div className="rang_block_outer">
                                <div className="rang_block orange_r">
                                    <div className="rang_inner">
                                        {fetchedUser.hasOwnProperty("avatar_border") && fetchedUser.avatar_border === 1 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }
                                        {!fetchedUser.hasOwnProperty("balls") || fetchedUser.balls < 20 &&
                                        <Icon24LockOutline className={"done_vneshka"} fill={"white"}/>
                                        }

                                    </div>
                                </div>
                                <Title style={{marginTop: 10}} className="nu_Bold"
                                       level={3}>Ранг 2</Title>
                            </div>
                        </div>
                        <div onClick={() => setBorderAvatar(2)} style={{width: 100}}>
                            <div className="rang_block_outer">
                                <div className="rang_block white_r">
                                    <div className="rang_inner">
                                        {fetchedUser.hasOwnProperty("avatar_border") && fetchedUser.avatar_border === 2 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }
                                        {!fetchedUser.hasOwnProperty("balls") || fetchedUser.balls < 250 &&
                                        <Icon24LockOutline className={"done_vneshka"} fill={"white"}/>
                                        }
                                    </div>
                                </div>
                                <Title style={{marginTop: 10}} className="nu_Bold"
                                       level={3}>Ранг 3</Title>
                            </div>
                        </div>
                        <div onClick={() => setBorderAvatar(3)} style={{width: 100}}>
                            <div className="rang_block_outer">
                                <div className="rang_block yellow_r">
                                    <div className="rang_inner">
                                        {fetchedUser.hasOwnProperty("avatar_border") && fetchedUser.avatar_border === 3 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }
                                        {!fetchedUser.hasOwnProperty("balls") || fetchedUser.balls < 500 &&
                                        <Icon24LockOutline className={"done_vneshka"} fill={"white"}/>
                                        }
                                    </div>
                                </div>
                                <Title style={{marginTop: 10}} className="nu_Bold"
                                       level={3}>Ранг 4</Title>
                            </div>
                        </div>
                        {/* <div className="rang_block_outer">
                            <div className="rang_block red_r">
                                <div className="rang_inner">
                                    <Icon24LockOutline className={"done_vneshka"} fill={"white"}/>
                                </div>
                            </div>
                            <Title style={{marginTop: 10}} className="nu_Bold"
                                   level={3}>Ранг 5</Title>
                        </div>*/}

                    </Gallery>

                </Group>
                {fetchedUser && fetchedUser.place_rating >= 1 && fetchedUser.place_rating < 4 &&
                <div >
                    <Title style={{marginTop: 30}} className="nu_Extra_Bold vip_"
                           level={3}>Вам доступна уникальная обводка</Title>
                    <div className="out_out role_obvds">
                        <div className="vip_rangs">
                            {fetchedUser.place_rating === 1 &&
                            <div
                                onClick={() => {
                                    setBorderAvatar(10)
                                }}
                                className="rang_block_outer vip_rang">
                                <div style={{width:60,height:60}} className="rang_block top_gradient_purpl vip">
                                    <div className="rang_inner">
                                        {fetchedUser.avatar_border === 10 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }

                                    </div>
                                </div>
                                <Subhead style={{marginTop: 10}} className="nu_Semi_Bold"
                                       level={3}>1 Место в рейтинге</Subhead>
                            </div>
                            }
                            {fetchedUser.place_rating === 2 &&
                            <div
                                onClick={() => {
                                    setBorderAvatar(11)
                                }}
                                className="rang_block_outer vip_rang">
                                <div style={{width:60,height:60}} className="rang_block orange_gradient">
                                    <div className="rang_inner">
                                        {fetchedUser.avatar_border === 11 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }
                                    </div>
                                </div>
                                <Title style={{marginTop: 10}} className="nu_Bold"
                                       level={3}>2 Место в рейтинге</Title>
                            </div>}
                            {fetchedUser.place_rating === 3 &&
                            <div
                                onClick={() => {
                                    setBorderAvatar(12)
                                }}
                                className="rang_block_outer vip_rang">
                                <div style={{width:60,height:60}} className="rang_block pink_gradient ">
                                    <div className="rang_inner">
                                        {fetchedUser.avatar_border === 12 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }
                                    </div>
                                </div>
                                <Subhead style={{marginTop: 10}} className="nu_Semi_Bold"
                                       level={3}>3 Место в рейтинге</Subhead>
                            </div>}

                        </div>
                    </div>
                    <Separator style={{margin:20}}/>
                </div>
                }

                {activeObvod !== null &&
                <div>
                    <Title style={{marginTop: 30}} className="nu_Extra_Bold vip_"
                           level={3}>Авторы</Title>
                    <div className="out_out role_obvds">
                        <div className="vip_rangs">
                            {activeObvod === 7 &&
                            <div
                                onClick={() => {
                                    setBorderAvatar(7)
                                }}
                                className="rang_block_outer vip_rang">
                                <div className="rang_block scen_r vip">
                                    <div className="rang_inner">
                                        {fetchedUser.avatar_border === 7 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }

                                    </div>
                                </div>
                                <Title style={{marginTop: 10}} className="nu_Bold"
                                       level={3}>Сценарист</Title>
                            </div>
                            }
                            {activeObvod === 8 &&
                            <div
                                onClick={() => {
                                    setBorderAvatar(8)
                                }}
                                className="rang_block_outer vip_rang">
                                <div className="rang_block taiper_r">
                                    <div className="rang_inner">
                                        {fetchedUser.avatar_border === 8 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }
                                    </div>
                                </div>
                                <Title style={{marginTop: 10}} className="nu_Bold"
                                       level={3}>Тайпер</Title>
                            </div>}
                            {activeObvod === 9 &&
                            <div
                                onClick={() => {
                                    setBorderAvatar(9)
                                }}
                                className="rang_block_outer vip_rang">
                                <div className="rang_block designer_r">
                                    <div className="rang_inner">
                                        {fetchedUser.avatar_border === 9 ?
                                            <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                        }
                                    </div>
                                </div>
                                <Title style={{marginTop: 10}} className="nu_Bold"
                                       level={3}>Дизайнер</Title>
                            </div>}

                        </div>
                    </div>
                </div>
                }


                <Title style={{marginTop: 30}} className="nu_Extra_Bold vip_"
                       level={3}>VIP - Обводка</Title>
                <div className="out_out">
                    <div className="vip_rangs">
                        <div
                            onClick={() => {
                                if (bought && !bought.find(el => el.id === 0))
                                    bridge.send("VKWebAppShowOrderBox", {type: "item", item: "obvod_0"})
                                        .then(data => {
                                            if (data.success) {
                                                setTimeout(() => {
                                                    updateUser();
                                                }, 1500)

                                            }
                                        })
                                        .catch(error => console.log(error));
                                else {
                                    setBorderAvatar(4)
                                }
                            }}
                            className="rang_block_outer vip_rang">
                            <div className="rang_block diamond_r vip">
                                <div className="rang_inner">
                                    {(!bought || bought.length === 0 || !bought.find(el => el.id === 0)) &&
                                    <Title style={{marginTop: 10, color: "white"}} className="nu_Bold"
                                           level={3}>VIP</Title>
                                    }
                                    {bought && bought.find(el => el.id === 0) && fetchedUser.avatar_border === 4 ?
                                        <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                    }

                                </div>
                            </div>
                            <Title style={{marginTop: 10}} className="nu_Bold"
                                   level={3}>Изумруд</Title>
                        </div>
                        <div
                            onClick={() => {
                                if (bought && !bought.find(el => el.id === 1))
                                    bridge.send("VKWebAppShowOrderBox", {type: "item", item: "obvod_1"})
                                        .then(data => {
                                            if (data.success) {
                                                setTimeout(() => {
                                                    updateUser();
                                                }, 1500)

                                            }
                                        })
                                        .catch(error => console.log(error));
                                else {
                                    setBorderAvatar(5)
                                }
                            }}
                            className="rang_block_outer vip_rang">
                            <div className="rang_block bril_r">
                                <div className="rang_inner">
                                    {(!bought || bought.length === 0 || !bought.find(el => el.id === 1)) &&
                                    <Title style={{marginTop: 10, color: "white"}} className="nu_Bold"
                                           level={3}>VIP</Title>
                                    }
                                    {bought && bought.find(el => el.id === 1) && fetchedUser.avatar_border === 5 ?
                                        <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                    }
                                </div>
                            </div>
                            <Title style={{marginTop: 10}} className="nu_Bold"
                                   level={3}>Сапфир</Title>
                        </div>
                        <div
                            onClick={() => {
                                if (bought && !bought.find(el => el.id === 2))
                                    bridge.send("VKWebAppShowOrderBox", {type: "item", item: "obvod_2"})
                                        .then(data => {
                                            if (data.success) {
                                                setTimeout(() => {
                                                    updateUser();
                                                }, 1500)

                                            }
                                        })
                                        .catch(error => console.log(error));
                                else {
                                    setBorderAvatar(6)
                                }
                            }}
                            className="rang_block_outer vip_rang">
                            <div className="rang_block izumrud_r">
                                <div className="rang_inner">
                                    {(!bought || bought.length === 0 || !bought.find(el => el.id === 2)) &&
                                    <Title style={{marginTop: 10, color: "white"}} className="nu_Bold"
                                           level={3}>VIP</Title>
                                    }
                                    {bought && bought.find(el => el.id === 2) && fetchedUser.avatar_border === 6 ?
                                        <Icon24DoneOutline className={"done_vneshka"} fill={"white"}/> : ""
                                    }
                                </div>
                            </div>
                            <Title style={{marginTop: 10}} className="nu_Bold"
                                   level={3}>Бриллиант</Title>
                        </div>

                    </div>
                </div>
            </Div>
        </Panel>
    )
}
export default Customize;