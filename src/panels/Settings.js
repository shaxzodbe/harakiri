import React, {useEffect, useState} from "react";
import {
    Panel,
    PanelHeader,
    Snackbar,
    Card,
    Title,
    Div,
    Avatar,
    CellButton,
    Button,
    View,
    Badge,
    Subhead, IconButton, ScreenSpinner
} from "@vkontakte/vkui";
import {Icon24Favorite, Icon28HelpCircleOutline, Icon28Search} from "@vkontakte/icons";
import {Icon24PenOutline} from '@vkontakte/icons';
import {Icon28PaletteOutline} from '@vkontakte/icons';
import {Icon28BookOutline} from '@vkontakte/icons';
import {Icon28ErrorCircleOutline} from '@vkontakte/icons';
import {Icon56BlockOutline} from '@vkontakte/icons';
import SettingsModal from "../components/SettingsModal";
import { Icon28WorkOutline } from '@vkontakte/icons';
import { Icon24FavoriteOutline } from '@vkontakte/icons';
import { Icon56Stars3Outline } from '@vkontakte/icons';
import { Icon56GiftOutline } from '@vkontakte/icons';
import { Icon56GestureOutline,Icon16Done } from '@vkontakte/icons';
import { Icon28ChainOutline } from '@vkontakte/icons';
import Helper from "../components/Helper"
import Continue from "../components/Continue";
import {Carousel} from "react-responsive-carousel";
import { Icon24CalendarOutline } from '@vkontakte/icons';
const Settings = ({id,theme,favorite_is,UserController,setActiveStory,setUser, fetchedUser,go,bridge}) => {
    const HelperD = new Helper();
    const [activeModal,setModal] = useState(null);
    const [snackbar,setSnackBar] = useState(null)
    const [popout,setPopout] = useState(null)
    useEffect(() => {
        if(fetchedUser)
            updatedata();

    }, [])
    const copyLink = () =>{
        bridge.send("VKWebAppCopyText", {"text": `https://m.vk.com/app7968308#${fetchedUser._id}`});
        setSnackBar(
            <Snackbar
            onClose={() => setSnackBar(null)}

            before={<Avatar size={24} style={{ background: 'rgb(147, 127, 245)' }}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
        >
            Ссылка скопирована
        </Snackbar>
        )
    }
    const updatedata = () =>{

            UserController.findProfile(fetchedUser).then((r)=>{

                setUser(r)
            })
    }
    if(fetchedUser)
    return (
        <View popout={popout} activePanel={id} modal={<SettingsModal tema={theme} fetchedUser={fetchedUser} setUser={updatedata} bridge={bridge} user={fetchedUser} updatedata={updatedata} UserController={UserController} setPopout={setPopout} copyLink={copyLink} setModal={setModal} activeModal={activeModal} />}>
            <Panel id={id}>
                <PanelHeader
                    left={<Icon28Search onClick={()=>setActiveStory("search")} className="ztc" style={{marginLeft:5}} />}
                    separator={false}
                    className={"x"}
                > <Title className="tight_title setting_headers nu_Extra_Bold"
                         level={2}>Пользователь</Title></PanelHeader>
                <Div>
                    <div className="settings_people">
                        <div className={`avatarBorder ${fetchedUser && fetchedUser.hasOwnProperty("avatar_border") ?
                            HelperD.getNameOfBorder(fetchedUser.avatar_border):HelperD.getNameOfBorder(0) }`}>
                            <Avatar size={54} className={"avatar_people"}
                                    src={fetchedUser && fetchedUser.photo_100}/>
                        </div>
                        <div className="settings_people_info">
                            <Title className="tight_title nu_Bold d11" level={3}
                            >{fetchedUser && fetchedUser.name ? fetchedUser.name : fetchedUser ? `${fetchedUser.first_name} ${fetchedUser.last_name}` : ``}</Title>
                            <div className="detail">
                                <span className={"nu_Bold"}>{fetchedUser && fetchedUser.hasOwnProperty("balls") ? fetchedUser.balls : 0}</span>
                                <span style={{color: "#cdcfd2"}}> рейтинг | </span>
                                <span className={"nu_Bold"}>{fetchedUser && fetchedUser.place_rating}</span>
                                <span style={{color: "#cdcfd2"}}> место</span>

                            </div>
                        </div>
                        <div>

                            <IconButton onClick={()=>setModal("info")}>
                                <Icon24PenOutline className={"dd1"} fill={"#99A2AD"}/>
                            </IconButton>
                            {(fetchedUser && fetchedUser.works && fetchedUser.works.length > 0) && (!fetchedUser.description || !fetchedUser.group) &&
                            <Badge style={{pointerEvents:"none"}} className="thisIsBadge" mode="prominent" aria-label="Есть новые"/>
                            }
                        </div>

                    </div>
                    {fetchedUser && fetchedUser.works && fetchedUser.works.length > 0 &&
                        <div className="error_filled">
                            {!fetchedUser.description &&
                            <Subhead style={{color: "red", width: "100%"}} className="tight_title nu_Semi_Bold d11"
                                     level={3}
                            >Напишите о себе</Subhead>
                            }
                            {!fetchedUser.group &&
                            <Subhead style={{color: "red", width: "100%"}} className="tight_title nu_Semi_Bold d11"
                                     level={3}
                            >Добаавьте группу в свой профиль</Subhead>
                            }
                        </div>
                    }
                    <div className="settings_buttons">
                        <CellButton expandable={true}  onClick={go} data-to={"customize"} before={<Icon28PaletteOutline fill={"#937FF5"}/>}><span className={`nu_Semi_Bold sbtns ${Helper.getColorForTheme(theme)}`}>Внешний вид</span></CellButton>
                        <CellButton expandable={true} onClick={go} data-to={"rules"} before={<Icon28BookOutline fill={"#937FF5"}/>}><span className={`nu_Semi_Bold sbtns ${Helper.getColorForTheme(theme)}`}>Правила платформы</span></CellButton>
                        <CellButton onClick={()=>setModal("about_app")} expandable={true}   before={<Icon28ErrorCircleOutline fill={"#937FF5"}/>}><span className={`nu_Semi_Bold sbtns ${Helper.getColorForTheme(theme)}`}>О приложении</span></CellButton>
                        <CellButton onClick={()=>setModal("worker")} expandable={true}  before={<Icon28WorkOutline fill={"#937FF5"}/>}><span className={`nu_Semi_Bold sbtns ${Helper.getColorForTheme(theme)}`}>Вакансии</span></CellButton>
                        <CellButton onClick={()=>setModal("error")} expandable={true}   before={<Icon28HelpCircleOutline fill={"#937FF5"}/>}><span className={`nu_Semi_Bold sbtns ${Helper.getColorForTheme(theme)}`}>Есть вопросы?</span></CellButton>
                    </div>
                    <div className="card_non_ads" style={{marginBottom:50}}>
                        <Carousel className={"mainCar kilde"} centerSlidePercentage={100}  centerMode={false}
                                  showArrows={false}
                                  autoPlay={false} showThumbs={false} infiniteLoop={false} showStatus={false}>
                            <Card className={"orange_gradient2 some_card"} style={{height: 200}} size="l">
                                <Icon56BlockOutline width={90} height={90} className={"block_abs"} fill={"white"}/>
                                <div className="card_text">
                                    <Title className="tight_title nu_Extra_Bold " level={1}>Без рекламы</Title>
                                    <Title className="tight_title nu_Semi_Bold " level={3}>Больше никакой рекламы</Title>
                                </div>
                                <Button onClick={()=> {
                                    updatedata();
                                    setModal("premium")
                                }} size={"l"} className={"card_button"}>
                                    <span>Получить премиум</span>
                                </Button>

                            </Card>
                            <Card className={"orange_gradient2 some_card"} style={{height: 200}} size="l">
                                <Icon24CalendarOutline style={{transform: "translate(-55%, -53%)"}} width={90} height={90} className={"block_abs"} fill={"white"}/>
                                <div className="card_text">
                                    <Title className="tight_title nu_Extra_Bold " level={1}>Ранний доступ</Title>
                                    <Title className="tight_title nu_Semi_Bold " level={3}>Получай раньше всех обновление</Title>
                                </div>
                                <Button onClick={()=>setModal("premium")} size={"l"} className={"card_button"}>
                                    <span>Получить премиум</span>
                                </Button>

                            </Card>
                            <Card className={"orange_gradient2 some_card"} style={{height: 200}} size="l">
                                <Icon56GiftOutline width={90} height={90} className={"block_abs"} fill={"white"}/>
                                <div className="card_text">
                                    <Title className="tight_title nu_Extra_Bold " level={1}>Повысь рейтинг</Title>
                                    <Title className="tight_title nu_Semi_Bold " level={3}>+ 2000 к твоему рейтингу</Title>
                                </div>
                                <Button onClick={()=> {
                                    updatedata();
                                    setModal("premium")
                                }} size={"l"} className={"card_button"}>
                                    <span>Получить премиум</span>
                                </Button>

                            </Card>
                            <Card className={"orange_gradient2 some_card"} style={{height: 200}} size="l">
                                <Icon56GestureOutline width={90} height={90} className={"block_abs"} fill={"white"}/>
                                <div className="card_text">
                                    <Title className="tight_title nu_Extra_Bold " level={1}>Поддержка</Title>
                                    <Title className="tight_title nu_Semi_Bold " level={3}>Поддержка проекта</Title>
                                </div>
                                <Button onClick={()=> {
                                    updatedata();
                                    setModal("premium")
                                }} size={"l"} className={"card_button"}>
                                    <span>Получить премиум</span>
                                </Button>

                            </Card>
                          {/*  <Card className={"orange_gradient2 some_card"} style={{height: 200}} size="l">
                                <Icon28ChainOutline width={90} height={90} className={"block_abs"} fill={"white"}/>
                                <div className="card_text">
                                    <Title className="tight_title nu_Extra_Bold " level={1}>Бесплатно</Title>
                                    <Title className="tight_title nu_Semi_Bold " level={3}>Пригласи 50 ({fetchedUser && fetchedUser.invited_peoples ? fetchedUser.invited_peoples : 0}) друзей</Title>
                                </div>
                                <Button onClick={()=> {
                                    updatedata();
                                    setModal("premium")
                                }} size={"l"} className={"card_button"}>
                                    <span>Скопировать ссылку</span>
                                </Button>

                            </Card>*/}
                        </Carousel>

                    </div>
                    <Button onClick={()=>{
                        bridge.send("VKWebAppAddToFavorites");
                    }} stretched size={"l"} before={
                        favorite_is === 0 ?
                        <Icon24FavoriteOutline fill={"#937FF5"}/> :
                        <Icon24Favorite fill={"#937FF5"}/>
                    } className={"purple_border_ " }>
                        <span className="nu_Extra_Bold">Добавить в избранное</span>
                    </Button>
                </Div>
                {snackbar}
            </Panel>

        </View>
    )
    else
        return (
            <View activePanel={id}>
                <Panel id={id}>
                    <ScreenSpinner/>
                </Panel>
            </View>
        )
}

export default Settings;