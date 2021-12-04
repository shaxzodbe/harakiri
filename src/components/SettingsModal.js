import React, {useState, useEffect} from "react"
import {
    ModalRoot,
    ModalPage,
    ModalPageHeader,
    useAdaptivity,
    usePlatform,
    ViewWidth,
    IOS, Textarea, FormItem, ModalCard,
    ANDROID,
    Div,
    PanelHeaderButton,
    PanelHeaderClose, Title, Button, Alert, Header, Input, Subhead, Link,
} from "@vkontakte/vkui";
import {Icon24ClockOutline, Icon24Dismiss, Icon28CalendarOutline, Icon28HelpCircleOutline} from "@vkontakte/icons"
import diamond from "../img/diamond.png"
import {Icon28GiftOutline} from '@vkontakte/icons';
import {Icon24BlockOutline} from '@vkontakte/icons';
import {Icon20Stars} from '@vkontakte/icons';
import {Icon28GestureOutline} from '@vkontakte/icons';
import {Icon56DiamondOutline} from '@vkontakte/icons';
import logo from "../img/logo.png"
import { Icon28WorkOutline } from '@vkontakte/icons';
import Helper from "./Helper";
const SettingsModal = ({activeModal, updatedata,fetchedUser,tema,setUser, UserController, setPopout, user, copyLink, setModal, bridge}) => {
    const {viewWidth} = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;
    const platform = usePlatform();
    const [description, setDescription] = useState("")
    const [group, setGroup] = useState("")
    const modalBack = () => {
        updatedata();
        setModal(null)
    }
    const saveInfo = () => {
        if (group)
            if (isValidUrl(group) && group.split("/")[2] === "vk.com") {
                UserController.updateDescription({description: description, group: group}).then(() => {
                    modalBack();
                })
            } else {
                setPopout(
                    <Alert
                        actions={[{
                            title: 'Ок',
                            autoclose: true,
                            mode: 'cancel'
                        }]}
                        actionsLayout="horizontal"
                        onClose={() => setPopout(null)}
                        header="Ошибка"
                        text="Введите корректную ссылку на группу"
                    />
                )
            }
        else
            UserController.updateDescription({description: description}).then(() => {
                modalBack();
            })


    }
    const isValidUrl = (url) => {
        try {
            new URL(url);
        } catch (e) {
            console.error(e);
            return false;
        }
        return true;
    };
    useEffect(() => {
        if (user && user.group) {
            setGroup(user.group)
        }
        if (user && user.description) {
            setDescription(user.description)
        }
    }, [])
    return (
        <ModalRoot
            activeModal={activeModal}
            onClose={modalBack}
        >
            <ModalPage
                id={"premium"}
                onClose={modalBack}
                settlingHeight={100}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }
            >
                <Div className={"diamond_hhr"}>
                    <img className="diamond_svg" width={146} height={125} src={diamond}/>
                    <Title className="tight_title nu_Extra_Bold gd2" style={{marginTop: 20}} level={1}>Премиум
                        аккаунт</Title>
                   {/* <Title className="tight_title nu_Bold" style={{marginTop: 20, width: "100%"}} level={3}>
                        Очень интересный текст очень интересный текст фс оченфсфыь интересный текссы ы ффыфы очень
                        интересный теыфыфкст с
                    </Title>*/}

                </Div>
                <div className="dostoins">
                    <div className="back__">
                        <div className="ds_1">
                            <Icon24BlockOutline/>
                            <Title className="tight_title nu_Bold" style={{width: "100%"}} level={3}>
                                Отключение рекламы
                            </Title>

                        </div>
                        <div className="ds_1">
                            <Icon28CalendarOutline width={28} height={28}/>
                            <Title className="tight_title nu_Bold" style={{width: "100%"}} level={3}>
                                Получайте обновления первыми
                            </Title>

                        </div>
                        <div className="ds_1">
                            <Icon28GiftOutline/>
                            <Title className="tight_title nu_Bold" style={{width: "100%"}} level={3}>
                                +2000 к рейтингу
                            </Title>

                        </div>
                        <div className="ds_1">
                            <Icon28GestureOutline/>
                            <Title className="tight_title nu_Bold" style={{width: "100%"}} level={3}>
                                Поддержка проекта
                            </Title>

                        </div>
                    </div>

                </div>
                <Div className={"div_buttons"}>
                    <Button disabled={!!fetchedUser.vip} onClick={() => {
                        UserController.getVip({}).then(r=>{
                            if(!r.vip){
                                bridge.send("VKWebAppShowOrderBox", {type:"item",item:"vip"})
                                    .then(data => {
                                        if(data.success){
                                            setUser();
                                            setTimeout(()=>{
                                                setModal(null)
                                            },200)
                                        }
                                    })
                                    .catch(error => console.log(error));
                            }
                        })

                    }} size={"l"} className="nu_Extra_Bold orange_gradient noBorder">{!!fetchedUser.vip ? "Вы уже оформили VIP": `Получить премиум за 15 голосов`}</Button>
                    {/*<Title className="tight_title nu_Semi_Bold" style={{width: "100%", marginTop: 10, fontSize: 13}}
                           level={3}>
                        или пригласи 50 ({fetchedUser.invited_peoples ? fetchedUser.invited_peoples : 0}) друзей и получи бесплатно
                    </Title>
                    <div className="copyLink_">
                        <Button onClick={() => {
                            setModal(null)
                            copyLink();
                        }} style={{flex: 1}} mode={"outline"} size={"l"}
                                className="nu_Extra_Bold  gradient_border">Ссылка</Button>
                        <Button style={{marginLeft: 5}} mode={"outline"} size={"l"}
                                className="nu_Extra_Bold  gradient_border">Поделиться в истории</Button>
                    </div>*/}
                </Div>
            </ModalPage>
            <ModalPage
                id={"info"}
                dynamicContentHeight
                onClose={modalBack}
                header={
                    <ModalPageHeader
                        right={isMobile && platform === IOS &&
                        <PanelHeaderButton onClick={modalBack}><Icon24Dismiss/></PanelHeaderButton>}
                        left={isMobile && platform === ANDROID && <PanelHeaderClose onClick={modalBack}/>}
                    >

                    </ModalPageHeader>
                }
            >
                <Div>
                    <FormItem top="Напиши о себе">
                        <Textarea value={description} onChange={(e) => setDescription(e.currentTarget.value)}
                                  placeholder="Я молодой и талатливый бизнесмен!"/>
                    </FormItem>
                    {user && user.works && user.works.length > 0 &&
                    <FormItem top="Добавь ссылку на свою группу VK">
                        <Input value={group} onChange={(e) => setGroup(e.currentTarget.value)}
                               placeholder="https://vk.com/ru.foxcomics"/>
                    </FormItem>
                    }
                    <Button onClick={saveInfo} stretched={true} style={{marginTop: 20,color:"white"}}
                            className={`noBorder purple_gradient`}
                            size={"l"}>Сохранить</Button>
                </Div>
            </ModalPage>
            <ModalCard
                id={"about_app"}
                onClose={() => setModal(null)}
                icon={<img src={logo} width={56} height={56} />}
                header="О приложении"
                subheader="Fox Comics - это приложение, с RU произведениями, которое захватит ваше сердечко"
                actions={
                    <Button size="l" mode="primary" onClick={()=>setModal(null)}>
                        Окей
                    </Button>
                }
            >

            </ModalCard>
            <ModalCard
                id={"worker"}
                onClose={() => setModal(null)}
                icon={<Icon28WorkOutline width={56} height={56} fill={"rgb(147, 127, 245)"} />}
                header="Вакансии"
                actions={
                    <Button size="l" mode="primary" onClick={()=>setModal(null)}>
                        Окей
                    </Button>
                }
            >
                <Subhead style={{width:"100%",marginTop:10}} className="tight_title nu_Semi_Bold " level={3}>
                    Команда Fox Comics всегда в поисках хороших специалистов! Если вы хотите стать нашим художником или сценаристом, свяжитесь с нами через <Link href={"https://vk.com/vladknz"} target={"_blank"}>менеджера</Link>. Для вступления в нашу команду придётся пройти входное тестирование. Не переживайте, если с первого раза не получилось, всегда можно попробовать снова!
                </Subhead>
            </ModalCard>
            <ModalCard
                id={"error"}
                onClose={() => setModal(null)}
                icon={<Icon28HelpCircleOutline width={56} height={56} fill={"rgb(147, 127, 245)"} />}
                header="Есть вопросы?"
                actions={
                    <Button size="l" mode="primary" onClick={()=>setModal(null)}>
                        Окей
                    </Button>
                }
            >
                <Subhead style={{width:"100%",marginTop:10}} className="tight_title nu_Semi_Bold " level={3}>
                     Если у вас есть вопросы по работе приложения, или вы нашли ошибку - свяжитесь с нашим <Link href={"https://vk.com/vladknz"} target={"_blank"}>менеджером</Link>.
                </Subhead>
            </ModalCard>
        </ModalRoot>
    )

}
export default SettingsModal;