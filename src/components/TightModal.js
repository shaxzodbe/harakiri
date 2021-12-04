import React, {useState, useEffect} from "react"
import {
    ModalRoot,
    ModalPage,
    ModalPageHeader,
    useAdaptivity,
    usePlatform,
    ViewWidth,
    IOS, Alert,
    ANDROID,
    PanelHeaderButton,
    PanelHeaderClose,
    Group,
    FormItem,
    Input,
    Div, Title, Button, Textarea, CellButton, Slider, ScreenSpinner, ModalCard
} from "@vkontakte/vkui";
import $ from "jquery"
import {Icon24Dismiss, Icon56LockOutline,Icon28LockOpenOutline, Icon56MoneyTransferOutline} from "@vkontakte/icons"
import SwipeRating from "./SwipeRating";
import Helper from "./Helper";

const TightModal = ({activeModal, setModal,updateManga,selectedGlav,tema, setPopout, prop, MangaController}) => {
    const [parametrs, setParametrs] = useState(0);
    const [syjet, setSyjet] = useState(5);
    const [risovka, setRisovka] = useState(5);
    const [persons, setPersons] = useState(5);
    const [obshyaa, setObshyaa] = useState(5);
    const [slideIndex,setIndex] = useState(0)
    const {viewWidth} = useAdaptivity();
    const isMobile = viewWidth <= ViewWidth.MOBILE;
    const platform = usePlatform();
    const modalBack = () => {
        setModal(null)
    }
    const sendArticle = () => {

        setPopout(<ScreenSpinner size='large'/>)
        let data = {
            manga_id: prop._id,
            name: $("#article_name").val(),
            article: $("#article_text").val(),
            syjet_rat: syjet,
            risovka_rat: risovka,
            person_rat: persons,
            obsh_rat: obshyaa,
        }
        $("#article_name").val("")
        $("#article_tex").val("")
        setObshyaa(5)
        setPersons(5)
        setRisovka(5)
        setSyjet(5)
        MangaController.addArticle(data).then((r) => {
            setPopout(null)
            let pop = null;
            if (!r.result) {
                pop = "Вы уже писали рецензию для этого произведения"
            } else pop = "Рецензия отправлена на модерацию"
            setPopout(<Alert
                actions={[{
                    title: 'Окей',
                    autoclose: true,
                    mode: 'cancel'
                }]}
                actionsLayout="horizontal"
                onClose={() => {
                    setPopout(null)
                    setModal(null)
                }}
                header="Рецензия"
                text={pop}
            />)
        })
    }
    useEffect(()=>{
       setIndex(0)
    },[activeModal])
    const sendRating = () =>{
        setPopout(<ScreenSpinner size='large'/>)
        let otzv = $("#rating_otzv").val();
        MangaController.addRating({otzv:otzv,rating:parseInt(slideIndex),manga_id: prop._id}).then((r)=>{
            setPopout(null)
            let pop = null;
            if (!r.result) {
                pop = "Вы уже оставляли оценку для этого произведения"
            } else {
                pop = [
                    "Извините... Мы постараемся делать лучше :(",
                    "Ох... Надеемся другие наши комиксы вам понравятся больше",
                    "Ну... Могло быть и хуже",
                    "Было близко... Мы обязательно сделаем лучше!",
                    "Спасибо за оценку! Будем стремиться к лучшему!",
                    "Спасибо за оценку! Дальше больше!",
                    "Спасибо за оценку! Не забудьте поддержать художника комментарием!",
                    "Спасибо за оценку! Рады стараться для вас!",
                    "Спасибо за оценку! Скоро будет ещё круче!",
                    "Спасибо за оценку! Мы рады, что вы цените нашу работу!",
                ]
                pop = pop[parseInt(slideIndex)]
            }
            updateManga();
            setPopout(<Alert
                actions={[{
                    title: 'Окей',
                    autoclose: true,
                    mode: 'cancel'
                }]}
                actionsLayout="horizontal"
                onClose={() => {
                    setPopout(null)
                    setModal(null)
                }}
                header="Оценка"
                text={pop}
            />)
        })
    }
    return (
        <ModalRoot
            activeModal={activeModal}
            onClose={modalBack}
        >
            <ModalPage
                id={"rating"}
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
                    <div className="modal_root_tight">
                        <div className="tight_avatar modal_avatar"
                             style={{backgroundImage: `url(https://foxcomics.ru${prop.avatar.substring(2).split(' ').join("%20")})`}}/>
                        <div className="modal_info_tight">
                            <Title style={{marginBottom: 15}} className="tight_title nu_Extra_Bold" level={2}
                                   weight>{prop.name}</Title>
                            <div className="tight_detailed">
                                <span className={"nu_Bold"}>{prop.year}</span>
                                <span style={{color: "#cdcfd2"}}>|</span>
                                <span className={"nu_Bold"}>{prop.genre[0]}</span>
                                <span style={{color: "#cdcfd2"}}>|</span>
                                <span className={"nu_Bold"}>{prop.age}</span>
                            </div>
                        </div>


                    </div>
                   {/* <Group>
                        <FormItem>
                            <Input id={"rating_otzv"} type="text" placeholder={"Написать отзыв..."}/>
                        </FormItem>
                    </Group>*/}
                </Div>
                <Div>
                    <div style={{display:"flex",flexDirection:"row",alignItems:'center',alignContent:"center"}}>
                        <Title style={{color: "black"}} className={"nu_Bold"} level="3" weight="regular">Оценка: &nbsp;</Title>
                        <Title
                            className={`nu_Bold  ${slideIndex < 5 ? "red_rating_no" : slideIndex >= 8 ? "green_rating_no" : "sred_rating_no"}`}
                            level="3" weight="regular">{
                            String(slideIndex).split('.')[1] === "0" ? String(slideIndex).split('.')[0] : slideIndex
                        }</Title>
                    </div>
                    <Slider
                        min={1}
                        max={10}
                        value={slideIndex}
                        onChange={value1 => setIndex(value1.toFixed(1))}
                    />
                </Div>

                {/*<div className="swipe_rating_div">
                    <SwipeRating slideIndex={slideIndex} setIndex={setIndex}/>
                </div>*/}
                <div style={{display: "flex", padding: 10}}>
                    <Button style={{color:"white"}} onClick={sendRating} stretched size={"l"} className={`nu_Extra_Bold purple_gradient ${Helper.getColorForTheme(tema)}`}>Оценить</Button>
                </div>

            </ModalPage>

            <ModalPage
                id={"article"}
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
                <Div>
                    <div className="modal_root_tight">
                        <div className="tight_avatar modal_avatar"
                             style={{backgroundImage: `url(https://foxcomics.ru${prop.avatar.substring(2).split(' ').join("%20")})`}}/>
                        <div className="modal_info_tight">
                            <Title style={{marginBottom: 15}} className="tight_title nu_Extra_Bold" level={2}
                                   weight>{prop.name}</Title>
                            <div className="tight_detailed">
                                <span className={"nu_Bold"}>{prop.year}</span>
                                <span style={{color: "#cdcfd2"}}>|</span>
                                <span className={"nu_Bold"}>{prop.genre[0]}</span>
                                <span style={{color: "#cdcfd2"}}>|</span>
                                <span className={"nu_Bold"}>{prop.age}</span>
                            </div>
                        </div>


                    </div>
                    <Group style={{marginBottom: 15}}>

                        <Input id={"article_name"} type="text" placeholder={"Написать название..."}/>
                        <Textarea id={"article_text"} style={{marginTop: 10, height: 150}}
                                  placeholder="Написать рецензию..."/>

                    </Group>
                    <CellButton onClick={() => setParametrs(0)} className={"flex_div_article"}>
                        <Title style={{color: "black"}} className={"nu_Bold"} level="3" weight="regular">Сюжет</Title>
                        <Title
                            className={`nu_Bold green_rating_no ${syjet < 5 ? "red_rating_no" : syjet >= 8 ? "green_rating_no" : "sred_rating_no"}`}
                            level="3" weight="regular">{
                            String(syjet).split('.')[1] === "0" ? String(syjet).split('.')[0] : syjet
                        }</Title>
                    </CellButton>
                    {parametrs === 0 &&
                    <Slider
                        min={1}
                        max={10}
                        value={syjet}
                        onChange={value1 => setSyjet(value1.toFixed(1))}
                    />
                    }
                    <CellButton onClick={() => setParametrs(1)} className={"flex_div_article"}>
                        <Title style={{color: "black"}} className={"nu_Bold"} level="3" weight="regular">Рисовка</Title>
                        <Title
                            className={`nu_Bold green_rating_no ${risovka < 5 ? "red_rating_no" : risovka >= 8 ? "green_rating_no" : "sred_rating_no"}`}
                            level="3" weight="regular">{
                            String(risovka).split('.')[1] === "0" ? String(risovka).split('.')[0] : risovka
                        }</Title>
                    </CellButton>
                    {parametrs === 1 &&
                    <Slider
                        min={1}
                        max={10}
                        value={risovka}
                        onChange={value1 => setRisovka(value1.toFixed(1))}
                    />
                    }
                    <CellButton onClick={() => setParametrs(2)} className={"flex_div_article"}>
                        <Title style={{color: "black"}} className={"nu_Bold"} level="3"
                               weight="regular">Персонажи</Title>
                        <Title
                            className={`nu_Bold green_rating_no ${persons < 5 ? "red_rating_no" : persons >= 8 ? "green_rating_no" : "sred_rating_no"}`}
                            level="3" weight="regular">{
                            String(persons).split('.')[1] === "0" ? String(persons).split('.')[0] : persons
                        }</Title>
                    </CellButton>
                    {parametrs === 2 &&
                    <Slider
                        min={1}
                        max={10}
                        value={persons}
                        onChange={value1 => setPersons(value1.toFixed(1))}
                    />
                    }
                    <CellButton onClick={() => setParametrs(3)} className={"flex_div_article"}>
                        <Title style={{color: "black"}} className={"nu_Bold"} level="3" weight="regular">Общая
                            оценка</Title>
                        <Title
                            className={`nu_Bold green_rating_no ${obshyaa < 5 ? "red_rating_no" : obshyaa >= 8 ? "green_rating_no" : "sred_rating_no"}`}
                            level="3" weight="regular">{
                            String(obshyaa).split('.')[1] === "0" ? String(obshyaa).split('.')[0] : obshyaa
                        }</Title>
                    </CellButton>
                    {parametrs === 3 &&
                    <Slider
                        min={1}
                        max={10}
                        value={obshyaa}
                        onChange={value1 => setObshyaa(value1.toFixed(1))}
                    />
                    }
                </Div>

                <div style={{display: "flex", padding: 10}}>
                    <Button onClick={sendArticle} stretched size={"l"}
                            className={`nu_Extra_Bold purple_gradient ${Helper.getColorForTheme(tema)}`}>Оценить</Button>
                </div>

            </ModalPage>
            <ModalCard
                id={"readerror"}
                onClose={() => setModal(null)}
                icon={<Icon28LockOpenOutline width={54} height={54} fill={"#735CE6"} />}
                header={`Глава ${selectedGlav && selectedGlav.glav+1}`}
                subheader={`Станет бесплатно ${selectedGlav && selectedGlav.time}`}
                actions={
                    <Button className="purple_gradient noBorder nu_Regular" size="l" mode="primary" onClick={() => setModal(null)}>
                        Ок
                    </Button>
                }
            >

            </ModalCard>
        </ModalRoot>
    )

}
export default TightModal;