import React, {useEffect, useState} from "react"
import {
    ANDROID, Avatar,
    Button, Div, Gallery, Group, Header,
    IOS,
    Link,
    ModalPage,
    ModalPageHeader, ModalRoot,
    PanelHeaderButton, PanelHeaderClose,
    Subhead,
    Title, useAdaptivity, usePlatform, ViewWidth
} from "@vkontakte/vkui";
import {Icon24Dismiss, Icon28UserOutline, Icon36Users3Outline, Icon56VideoOutline} from "@vkontakte/icons";
import {Carousel} from "react-responsive-carousel";
import Comic from "./Comic";
import Helper from "./Helper";

const UserModal = ({activeModal,tema,activeStory,activePanel, UserController,set_BACK_FROM_TIGHT,openTight,setActiveModal, setUser, user, setPop}) => {
    const HelperD = new Helper();
    const {viewWidth} = useAdaptivity();
    const [resultUser, setResultUser] = useState(null)
    const isMobile = viewWidth <= ViewWidth.MOBILE;
    const platform = usePlatform();
    const backModal = () => {
        setActiveModal(null)
        setUser(null)
    }
    useEffect(() => {
        if (user && !user.person) {
            UserController.findProfile(null, {fetchedUser: user, dont_insert: true}).then((res) => {

                setResultUser(res);
                setPop(null)
            })
        }else{
            setResultUser(user);
            setPop(null)
        }

    }, [user])
    return (
        <ModalRoot
            activeModal={activeModal}
            onClose={backModal}
        >
            <ModalPage
                id={"user_rating"}
                onClose={backModal}
                dynamicContentHeight
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={backModal}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={backModal}/>}
                    >

                    </ModalPageHeader>
                }
            >

                <div className="modal_user_info">

                    <div className={`avatarBorder ${resultUser && resultUser.hasOwnProperty("avatar_border") ?
                        HelperD.getNameOfBorder(resultUser.avatar_border) : HelperD.getNameOfBorder(0)}`}>
                        <Avatar size={90} className={"avatar_people"}
                                src={resultUser !== null ? resultUser.person ?
                                    `https://foxcomics.ru/uploads/${resultUser.photo ? resultUser.photo : null}`
                                    : resultUser.photo_100 : "https://vk.com/images/camera_200.png"}/>
                    </div>
                    <div className="settings_people_info modal_inf">
                        <Title className="tight_title nu_Bold d11" level={3}
                        >{resultUser !== null && resultUser.name}</Title>
                        {resultUser !== null && resultUser.result &&
                        <div className="detail">
                            <span
                                className={"nu_Bold"}>{resultUser && resultUser.hasOwnProperty("balls") ? resultUser.balls : 0}</span>
                            <span style={{color: "#cdcfd2"}}> {resultUser && Helper.getNormalWordBall(resultUser.hasOwnProperty("balls") ? resultUser.balls : 0)} | </span>
                            <span className={"nu_Bold"}>{resultUser && resultUser.place_rating}</span>
                            <span style={{color: "#cdcfd2"}}> место</span>

                        </div>
                        }
                        {resultUser !== null && resultUser.result === false &&
                        <Subhead style={{color: "red", width: "100%"}} className="tight_title nu_Semi_Bold d11"
                                 level={3}
                        >Пользователь ещё не зарегестрирован в нашем приложении</Subhead>
                        }

                    </div>
                </div>
                {resultUser && resultUser.person === true && resultUser.description &&
                <Div style={{paddingTop: 0}}>
                    <Subhead className="tight_title nu_Bold d11" level={3}>{resultUser.description}</Subhead>
                </Div>
                }
                {resultUser !== null && resultUser.result &&
                <Group className="modal_user_bio" header={
                    <Header   className="tight_title nu_Extra_Bold d11" level={3}>
                        <Title  className="tight_title nu_Bold d11 " level={2}><span className="cvb1">О себе</span></Title>
                    </Header>
                }>
                    {!resultUser.description &&
                    <Div style={{paddingTop: 0}}>
                        <Subhead style={{color: "grey", width: "100%"}} className="tight_title nu_Semi_Bold d11"
                                 level={3}
                        >Пользователь ещё не написал о себе</Subhead>
                    </Div>
                    }
                    {resultUser.description &&
                    <Div style={{paddingTop: 0}}>
                        <Subhead className="tight_title nu_Bold d11" level={3}>{resultUser.description}</Subhead>
                    </Div>
                    }


                </Group>
                }


                {resultUser !== null && resultUser.result && resultUser.works && resultUser.works.length > 0 &&
                <Group
                    separator={"hide"}
                    style={{paddingTop: 0}}
                    header={
                        <Header className="tight_title nu_Extra_Bold d11" level={3}>
                            <Title className="tight_title nu_Bold d11" level={2}>Работы</Title>
                        </Header>

                    }
                >
                    {/*<Carousel selectedItem={0} centerSlidePercentage={43} centerMode={true} showIndicators={false}
                              showArrows={false}
                              autoPlay={false} showThumbs={false} infiniteLoop={false} showStatus={false}>
                        <Comic rating={7.1}
                               img={"https://i.pinimg.com/736x/aa/5e/7d/aa5e7de00ed0c35a0c14622cd7f846fa--young-comic-book.jpg"}/>
                        <Comic rating={6.3}
                               img={"https://i.pinimg.com/originals/ad/37/31/ad373147c83d92264d68d2052a1073cd.jpg"}/>
                        <Comic rating={4.2}
                               img={"https://i.pinimg.com/originals/ad/37/31/ad373147c83d92264d68d2052a1073cd.jpg"}/>
                    </Carousel>*/}
                    <Gallery slideWidth="180px" style={{height: 280}}>
                        {resultUser.works.map((item, key) => {
                            let avatar = item.avatar.substring(2).split(' ').join("%20");
                            return (
                                <div style={{width: 150}}>
                                    <Comic name={item.name} onClick={() => {
                                        /*if(activePanel !== "home")
                                            set_BACK_FROM_TIGHT("reading");
                                        else
                                            set_BACK_FROM_TIGHT(activeStory);*/
                                        set_BACK_FROM_TIGHT("main");
                                        openTight(item)
                                        setActiveModal(null)
                                        setUser(null)
                                    }} key={key} rating={item.sredRating}
                                           img={`https://foxcomics.ru${avatar}`}/>
                                </div>

                            )

                        })}
                    </Gallery>
                </Group>
                }
                {/*Тут надо ещё проверять, указал ли он свои группы и т.д*/}
                {resultUser !== null && resultUser.result &&
                <Div className={"modal_useR_buttons"}>
                    {resultUser.hasOwnProperty("group") && resultUser.group &&
                    <Link style={{width: "100%",color:"white"}} href={resultUser.group} target="_blank">
                        <Button style={{margin:0}} size={"l"} stretched className={"purple_gradient  noBorder"}
                                before={<Icon36Users3Outline height={30} width={30} fill={"white"}/>}><span
                            className={`nu_Bold ${Helper.getColorForTheme(tema)}`}>Группа</span></Button>
                    </Link>
                    }
                    {resultUser.hasOwnProperty("group") && resultUser.group && <div style={{width:20}}/>}

                    <Link style={{width: "100%"}} href={`https://vk.com/id${resultUser._id}`} target="_blank">
                        <Button style={{margin:0,color:"white"}} size={"l"} stretched className={"purple_gradient noBorder"}
                                before={<Icon28UserOutline height={30} width={30} fill={"white"}/>}><span
                            className={`nu_Bold `}>Профиль</span></Button>
                    </Link>

                </Div>
                }
                <div style={{height: 50}}/>
            </ModalPage>
        </ModalRoot>
    )
}

export default UserModal;