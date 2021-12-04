import React, {useState, useEffect} from "react";
import {Button, Div, Group, Header, Panel, View} from "@vkontakte/vkui";
import AdminModal from "../components/AdminModal";
import "../css/admin.css"

const Admin = ({id, MangasController, admin, NewsController, UserController}) => {
    const [activeModal, setModal] = useState(null);
    const [pop, setPop] = useState(null);
    const [manga, setManga] = useState(null);
    const [addNewGlav, setAddNeGlav] = useState(false)
    return (
        <View popout={pop} activePanel={id}
              modal={<AdminModal NewsController={NewsController} manga={manga} addNewGlav={addNewGlav}
                                 setManga={setManga} setAddNeGlav={setAddNeGlav} MangaController={MangasController}
                                 UserController={UserController} MangasController={MangasController} setPop={setPop}
                                 activeModal={activeModal} setModal={setModal}/>}>
            <Panel id={id}>
                <Div>
                    <Group header={
                        <Header>
                            Работа с мангой
                        </Header>
                    }>
                        {admin.role === "admin" ?
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <Button onClick={() => setModal("add_manga")}>Добавить мангу</Button>
                                <Button style={{marginTop: 10}} onClick={() => setModal("add_text_manga")}>Добавить
                                    текстовую мангу</Button>
                                <Button onClick={() => setModal("all_mangas")} style={{marginTop: 10}}>Список
                                    манги</Button>
                                <Button onClick={() => setModal("articles_modal")}
                                        style={{marginTop: 10}}>Рецензии</Button>
                                <Button onClick={() => setModal("statii")} style={{marginTop: 10}}>Добавить
                                    статью</Button>
                            </div> :
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <Button onClick={() => setModal("articles_modal")}
                                        style={{marginTop: 10}}>Рецензии</Button>
                                <Button onClick={() => setModal("statii")} style={{marginTop: 10}}>Добавить
                                    статью</Button>
                            </div>
                        }


                    </Group>
                    <Group header={
                        <Header>
                            Администрация
                        </Header>
                    }>
                        {admin.role === "admin" &&
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <Button onClick={() => setModal("add_admins")}>Добавить администрацию</Button>
                            <Button onClick={() => setModal("all_admins")} style={{marginTop: 10}}>Список
                                администрации</Button>
                        </div>
                        }


                    </Group>
                </Div>
            </Panel>
        </View>

    )
}
export default Admin;