import React, {useEffect, useState} from "react";
import {
    Panel,
    PanelHeader,
    Div,
    Tabs,
    TabsItem,
    Subhead,
    Title,
    Avatar,
    FixedLayout,
    Button,
    View,
    ModalRoot,
    ModalCard,
    ModalPage,
    PullToRefresh,
    IOS,
    PanelHeaderButton,
    ANDROID,
    PanelHeaderClose,
    useAdaptivity,
    ViewWidth,
    usePlatform,
    Group,
    Header, ScreenSpinner, ModalPageHeader
} from "@vkontakte/vkui";
import {
    Icon24BrainOutline, Icon24ClockOutline,
    Icon24GameOutline,
    Icon24MoneyCircleOutline,
    Icon28DiamondOutline,
    Icon36Users3Outline
} from '@vkontakte/icons';
import {Icon24Dismiss, Icon28Search} from "@vkontakte/icons";
import {Icon28HelpCircleOutline} from '@vkontakte/icons';
import {Icon24VideoOutline} from '@vkontakte/icons';
import {Icon56VideoOutline} from '@vkontakte/icons';
import {Icon28UserOutline} from '@vkontakte/icons';
import {Carousel} from "react-responsive-carousel";
import Comic from "../components/Comic";
import Helper from "../components/Helper";
import {Icon24CupOutline} from '@vkontakte/icons';

const Rating = ({id, UserController, tema, openUser, bridge}) => {
    const HelperD = new Helper();
    const [activeTab, setActiveTab] = useState("month")
    const {viewWidth} = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;
    const platform = usePlatform();
    const [activeModal, setModal] = useState(null);
    const backModal = () => setModal(null);
    const [ratingListMonth, setRatingListMonth] = useState(null)
    const [ratingListAll, setRatingListAll] = useState(null)
    const [popout, setPopout] = useState(null)
    const [fetching, setFetching] = useState(false)
    useEffect(() => {
        setPopout(<ScreenSpinner size='large'/>)
        UserController.getRating().then((rs) => {

            setRatingListMonth(rs.month)
            setRatingListAll(rs.all)
        })
    }, [])
    useEffect(() => {
        if (ratingListMonth)
            setPopout(null)
    }, [ratingListMonth])
    const modal = (
        <ModalRoot
            activeModal={activeModal}
            onClose={backModal}
        >
            <ModalCard
                id={"ads"}
                onClose={() => setModal(null)}
                icon={<Icon56VideoOutline fill={"#735CE6"}/>}
                header="???????????? ?????????????? ?? ?????????????? ??????????????"
                subheader="???????????? ???????????????? ?????????????? ???????????????? ?????? ?????????????? ???? 8 ????????????!"
                actions={
                    <Button stretched className={`purple_gradient noBorder`} style={{height: 40, color: "white"}}
                            silze={"l"} onClick={() => {
                        bridge.send("VKWebAppShowNativeAds", {ad_format: "reward"})
                            .then(data => {
                                if (data.result) {
                                    UserController.look_ads("");
                                }
                            })
                        setModal(null)
                    }}>
                        ???????????????? ??????????
                    </Button>
                }
            />
            <ModalPage
                id={"quest"}
                onClose={() => setModal(null)}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={() => setModal(null)}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={() => setModal(null)}/>}
                    >

                    </ModalPageHeader>
                }
            >
                <Div>
                    <div style={{marginTop: 0}} className={"info_settings"}>
                        <div className="name">
                            <Icon24CupOutline width={40} height={40} fill={"#937FF5"}/>
                            <Title className={"nu_Extra_Bold name_of_top"} level="2"
                                   weight="regular">?????? ???????????????? ???????????</Title>
                        </div>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">???? ???????????????????? ?? ???????????????????? ?????????? ???????????????? ??????????????</Title>
                    </div>
                    <div className={"info_settings"}>
                        <div className="name">
                            <Icon24GameOutline width={40} height={40} fill={"#937FF5"}/>
                            <Title className={"nu_Extra_Bold name_of_top"} level="2"
                                   weight="regular">???????? ????????????????????:</Title>
                        </div>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">???????????????? ?????????? - 10 ????????????
                        </Title>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">???????????????????? ?????????????????????? - 2 ??????????
                        </Title>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">?????????????????? ?????????????? - 5 ????????????
                        </Title>
                    </div>
                    <div className={"info_settings"}>
                        <div className="name">
                            <Icon24MoneyCircleOutline width={40} height={40} fill={"#937FF5"}/>
                            <Title className={"nu_Extra_Bold name_of_top"} level="2"
                                   weight="regular">???????????? ??????????????:</Title>
                        </div>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">???????????????????? Premium - 200 ????????????
                        </Title>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">?????????????? VIP ?????????????? - 100/200/500 ????????????
                        </Title>
                    </div>
                    <div className={"info_settings"}>
                        <div className="name">
                            <Icon28DiamondOutline width={40} height={40} fill={"#937FF5"}/>
                            <Title className={"nu_Extra_Bold name_of_top"} level="2"
                                   weight="regular">???????????????????? ??????????????:
                            </Title>
                        </div>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">???????????????? ?????????????? - 8 ????????????

                        </Title>
                    </div>
                    <div className={"info_settings"}>
                        <div className="name">
                            <Icon24BrainOutline width={40} height={40} fill={"#937FF5"}/>
                            <Title className={"nu_Extra_Bold name_of_top"} level="2"
                                   weight="regular">?????????? ?????????? ???????????
                            </Title>
                        </div>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">?????????? ?????????????? ?? ?????????????? ????????????, ???? ???????????? ???????????????? ???????? ???? ????????????????????
                            ???????????? ???????????????? ?????????? ?? ??????????????!
                        </Title>
                        <Title className={"nu_Semi_Bold name_of_top c"} level="3"
                               weight="regular">?? ?????????? ???? ???????????? ???? ?????? ?????????? ?????????? ???????????????? ???????????????????? ????????????????!
                        </Title>
                    </div>
                    <div className={"info_settings"}>
                        <div className="name">
                            <Icon24ClockOutline width={40} height={40} fill={"#937FF5"}/>
                            <Title className={"nu_Extra_Bold name_of_top"} level="2"
                                   weight="regular">???? ?????????? :
                            </Title>
                        </div>
                        <Title className={"nu_Semi_Bold name_of_top c jh"} level="3"
                               weight="regular">
                            1) ???????????????????? - ???????????????????? ????????-?????????????? ???? ???????????? ????????????<br/><br/>
                            2) ?????????????? ???? ?????????? ???? ?????????????????? Fox Comics<br/><br/>
                            3) ???????????? ?? ?????????????????????? Fox Comics + ?????????????????? VK<br/><br/>
                            4-7) ?????????????????? ?????????????????? VK
                        </Title>
                    </div>
                </Div>
            </ModalPage>
        </ModalRoot>
    )
    const refreshPage = () => {
        setFetching(true)
        UserController.getRating().then((rs) => {
            setRatingListMonth(rs.month)
            setRatingListAll(rs.all)
            setTimeout(() => {
                setFetching(false)
            }, 890)
        })
    }
    return (
        <View popout={popout} activePanel={id} modal={modal}>
            <Panel id={id}>
                <PanelHeader
                    style={{padding: 10, paddingBottom: 0}}
                    left={<Icon28HelpCircleOutline onClick={() => setModal("quest")}
                                                   className={Helper.getColorForTheme(tema)}/>}
                    separator={false}
                />
                {/*<PullToRefresh onRefresh={refreshPage} isFetching={fetching}>*/}
                <div className="header_tabs">
                <Tabs>
                    <TabsItem
                        onClick={() => {
                            if (activeTab !== "month")
                                setActiveTab("month")
                        }}
                        selected={activeTab === 'month'}
                    >
                        ???? ??????????
                    </TabsItem>
                    <TabsItem
                        onClick={() => {
                            if (activeTab !== "all")
                                setActiveTab("all")
                        }}
                        selected={activeTab === 'all'}
                    >
                        ???? ?????? ??????????
                    </TabsItem>
                </Tabs>
            </div>
            {activeTab === "month" && ratingListMonth && ratingListMonth.length > 0 &&
            <Div>
                <div className="top_ m">
                    {ratingListMonth[1] &&
                    <div onClick={() => openUser(ratingListMonth[1])} className={`top_block`}>
                        <div className={`top_2 `} onClick={() => setModal("user_rating")}>
                            <div
                                style={{padding:0}}
                                className={`background_of_top orange_gradient ${ratingListMonth[1] && ratingListMonth[1].hasOwnProperty("avatar_border") ?
                                    HelperD.getNameOfBorder(ratingListMonth[1].avatar_border) : HelperD.getNameOfBorder(0)}`}/>
                            <div style={{backgroundImage: `url(${ratingListMonth[1].photo_100 && ratingListMonth[1].photo_100})`}}
                                 className="avatar_of_top"/>
                            <div className="white_border_for_top"/>
                            <div style={{background: "#735CE6"}} className="place_of_top">
                                <Subhead weight="regular" className={"nu_Extra_Bold"}>2</Subhead>
                            </div>
                        </div>

                        <Title className={"nu_Bold name_of_top"} level="3"
                               weight="regular">{ratingListMonth[1].name}</Title>
                        <Title className={"nu_Bold top_2_txt"} level="3"
                               weight="regular">{ratingListMonth[1].hasOwnProperty("last_month") ? ratingListMonth[1].last_month.balls : 0}</Title>
                    </div>
                    }

                    <div onClick={() => openUser(ratingListMonth[0])} className="top_block">
                        <div className={"top_1"}>
                            <div
                                style={{padding:0}}
                                className={`background_of_top top_gradient_purpl ${ratingListMonth[0] && ratingListMonth[0].hasOwnProperty("avatar_border") ?
                                    HelperD.getNameOfBorder(ratingListMonth[0].avatar_border) : HelperD.getNameOfBorder(0)}`}/>
                            <div style={{backgroundImage: `url(${ratingListMonth[0].photo_100})`}}
                                 className="avatar_of_top"/>
                            <div className="white_border_for_top"/>
                            <div style={{background: "#735CE6"}} className="place_of_top">
                                <Subhead weight="regular" className={"nu_Extra_Bold"}>1</Subhead>
                            </div>
                        </div>

                        <Title className={"nu_Bold name_of_top"} level="3"
                               weight="regular">{ratingListMonth[0].name}</Title>
                        <Title className={"nu_Bold top_1_txt"} level="3"
                               weight="regular">{ratingListMonth[0].hasOwnProperty("last_month") ? ratingListMonth[0].last_month.balls : 0}</Title>
                    </div>
                    {ratingListMonth[2] &&
                    <div onClick={() => openUser(ratingListMonth[2])} className="top_block">
                        <div className={"top_3"}>
                            <div
                                style={{padding:0}}
                                className={`background_of_top pink_gradient ${ratingListMonth[2] && ratingListMonth[2].hasOwnProperty("avatar_border") ?
                                    HelperD.getNameOfBorder(ratingListMonth[2].avatar_border) : HelperD.getNameOfBorder(0)}`}/>
                            <div style={{backgroundImage: `url(${ratingListMonth[2].photo_100})`}}
                                 className="avatar_of_top"/>
                            <div className="white_border_for_top"/>
                            <div style={{background: "#735CE6"}} className="place_of_top ">
                                <Subhead weight="regular" className={"nu_Extra_Bold"}>3</Subhead>
                            </div>
                        </div>

                        <Title className={"nu_Bold name_of_top"} level="3"
                               weight="regular">{ratingListMonth[2].name}</Title>
                        <Title className={"nu_Bold top_2_txt"} level="3"
                               weight="regular">{ratingListMonth[2].hasOwnProperty("last_month") ? ratingListMonth[2].last_month.balls : 0}</Title>
                    </div>
                    }

                </div>
                <div className="top_list">
                    {ratingListMonth.map((item, key) => {
                        if (key >= 3)
                            return (
                                <div onClick={() => openUser(item)} className="top_people">
                                    <div className="k1">
                                        <div className={`avatarBorder ${item.hasOwnProperty("avatar_border") ?
                                            HelperD.getNameOfBorder(item.avatar_border) : HelperD.getNameOfBorder(0)}`}>
                                            <Avatar size={48} className={"avatar_people"}
                                                    src={item.photo_100}/>
                                        </div>
                                        <div className="top_people_info">
                                            <Title className={"nu_Bold"} level="3" weight="regular">{item.name}</Title>
                                            <Subhead
                                                className={"nu_Semi_Bold articleName"} level="3"
                                                weight="regular">{key + 1}-??
                                                ??????????</Subhead>
                                        </div>
                                    </div>
                                    <Title className={"nu_Bold"} level="3"
                                           weight="regular">{item.hasOwnProperty("last_month") ? item.last_month.balls : 0}</Title>

                                </div>
                            )
                    })
                    }

                    <div style={{height: 100}}/>
                </div>
            </Div>
            }
            {activeTab === "all" && ratingListAll && ratingListAll.length > 0 &&
            <Div>
                <div className="top_ a">
                    {ratingListAll[1] &&
                    <div onClick={() => openUser(ratingListAll[1])} className="top_block">
                        <div className={"top_2"} onClick={() => setModal("user_rating")}>
                            <div
                                style={{padding:0}}
                                className={`background_of_top orange_gradient ${ratingListAll[1] && ratingListAll[1].hasOwnProperty("avatar_border") ?
                                    HelperD.getNameOfBorder(ratingListAll[1].avatar_border) : HelperD.getNameOfBorder(0)}`}/>
                            <div style={{backgroundImage: `url(${ratingListAll[1].photo_100})`}}
                                 className="avatar_of_top"/>
                            <div className="white_border_for_top"/>
                            <div className="place_of_top">
                                <Subhead weight="regular" className={"nu_Extra_Bold"}>2</Subhead>
                            </div>
                        </div>

                        <Title className={"nu_Bold name_of_top"} level="3"
                               weight="regular">{ratingListAll[1].name}</Title>
                        <Title className={"nu_Bold top_2_txt"} level="3"
                               weight="regular">{ratingListAll[1].hasOwnProperty("balls") ? ratingListAll[1].balls : 0}</Title>
                    </div>
                    }

                    <div onClick={() => openUser(ratingListAll[0])} className="top_block">
                        <div className={"top_1"}>
                            <div

                                className={`background_of_top top_gradient_purpl ${ratingListAll[0] && ratingListAll[0].hasOwnProperty("avatar_border") ?
                                    HelperD.getNameOfBorder(ratingListAll[0].avatar_border) : HelperD.getNameOfBorder(0)}`}
                                style={{width: 100, height: 100,padding:0}}/>
                            <div style={{backgroundImage: `url(${ratingListAll[0].photo_100})`}}
                                 className="avatar_of_top"/>
                            <div className="white_border_for_top"/>
                            <div className="place_of_top">
                                <Subhead weight="regular" className={"nu_Extra_Bold"}>1</Subhead>
                            </div>
                        </div>

                        <Title className={"nu_Bold name_of_top"} level="3"
                               weight="regular">{ratingListAll[0].name}</Title>
                        <Title className={"nu_Bold top_1_txt"} level="3"
                               weight="regular">{ratingListAll[0].hasOwnProperty("balls") ? ratingListAll[0].balls : 0}</Title>
                    </div>
                    {ratingListAll[2] &&
                        <div onClick={() => openUser(ratingListAll[2])} className="top_block">
                            <div className={"top_3"}>
                                <div
                                    style={{padding:0}}
                                    className={`background_of_top pink_gradient ${ratingListAll[2] && ratingListAll[2].hasOwnProperty("avatar_border") ?
                                        HelperD.getNameOfBorder(ratingListAll[2].avatar_border) : HelperD.getNameOfBorder(0)}`}/>
                                <div style={{backgroundImage: `url(${ratingListAll[2].photo_100})`}}
                                     className="avatar_of_top"/>
                                <div className="white_border_for_top"/>
                                <div className="place_of_top pink_gradient">
                                    <Subhead weight="regular" className={"nu_Extra_Bold"}>3</Subhead>
                                </div>
                            </div>

                            <Title className={"nu_Bold name_of_top"} level="3"
                                   weight="regular">{ratingListAll[2].name}</Title>
                            <Title className={"nu_Bold top_2_txt"} level="3"
                                   weight="regular">{ratingListAll[2].hasOwnProperty("balls") ? ratingListAll[2].balls : 0}</Title>
                        </div>
                    }

                </div>
                <div className="top_list">
                    {ratingListAll.map((item, key) => {
                        if (key >= 3)
                            return (
                                <div onClick={() => openUser(item)} className="top_people">
                                    <div className="k1">
                                        <div className={`avatarBorder ${item.hasOwnProperty("avatar_border") ?
                                            HelperD.getNameOfBorder(item.avatar_border) : HelperD.getNameOfBorder(0)}`}>
                                            <Avatar size={48} className={"avatar_people"}
                                                    src={item.photo_100}/>
                                        </div>
                                        <div className="top_people_info">
                                            <Title className={"nu_Bold"} level="3" weight="regular">{item.name}</Title>
                                            <Subhead
                                                className={"nu_Semi_Bold articleName"} level="3"
                                                weight="regular">{key + 1}-??
                                                ??????????</Subhead>
                                        </div>
                                    </div>
                                    <Title className={"nu_Bold"} level="3"
                                           weight="regular">{item.hasOwnProperty("balls") ? item.balls : 0}</Title>

                                </div>
                            )
                    })
                    }

                    <div style={{height: 100}}/>
                </div>
            </Div>
            }

            {ratingListMonth &&
            <FixedLayout style={{padding: 10, height: 110}} filled vertical="bottom">
                <div className={"rating_fixed"} style={{display: "flex", width: "100%", marginBottom: 10}}>
                    <Button style={{color: "white"}} onClick={() => setModal("ads")} stretched
                            className={`purple_gradient noBorder`} silze={"l"}>????????????????
                        ??????????????</Button>
                </div>

            </FixedLayout>
            }
            {/*</PullToRefresh>*/}

        </Panel>
</View>

)
}

export default Rating;