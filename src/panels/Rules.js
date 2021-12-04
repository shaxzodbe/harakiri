import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button, CellButton,
    Div, Group, Header, HorizontalCell,
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

const Rules = ({id, tdema, go}) => {
    const [vneshka, setVneshka] = useState(0);
    const [tema, setTema] = useState(1);

    return (
        <Panel id={id}>
            <PanelHeader
                style={{padding: 10, paddingBottom: 0}}
                left={<Icon24ChevronLeft style={{marginLeft: 15}} className={Helper.getColorForTheme(tdema)}
                                         onClick={go} data-to={"settings"}/>}
                separator={false} shadow={false}
                className={"x"}
            > <Title className="tight_title setting_headers nu_Extra_Bold"
                     level={2}>Правила</Title></PanelHeader>
            {/* <Div style={{}}>
                <Title className="nu_Extra_Bold"
                       level={2}>Правила платформы Fox Comics</Title>
                <ul>
                    <li className="nu_Semi_Bold">
                        Администрация и Модерация оставляет за собой право удалять комментарии и/или ветки коментариев,
                        а так же пользовательский контент в случае нарушения вышеуказанных документов и/или последующих
                        пунктов правил.
                    </li>
                    <li className="nu_Semi_Bold">
                        Попытки ложной интерпретации и/или обход и/или злоупотребления недочётами правил недопустимы и в
                        большинстве случаев караются блокировкой.
                    </li>
                    <li className="nu_Semi_Bold">
                        Администрация и Модерация платформы оставляют за собой право блокировать пользователей
                        приложения в случаях вредительства, неописанных ниже. Мы за здоровый сканлейт и за здоровую
                        аудиторию, никакой токсичности 😉
                    </li>
                    <li className="nu_Semi_Bold">
                        Администрация оставляет за собой право изменять данные правила с извещением пользователей или
                        без каких-либо уведомлений.
                    </li>
                </ul>
            </Div>*/}
            <Div style={{marginTop: 20}}>
                <Title className="nu_Extra_Bold"
                       level={2}>В комментариях запрещены:</Title>
                <Div>
                        <span className="nu_Semi_Bold">
                   1. Оскорбления любых лиц, в том числе лиц, не участвующих в дискуссии.
                </span>
                </Div>
                <Div>
                        <span className="nu_Semi_Bold">
                    2. Спам, не зависимо от содержания.
                </span>
                </Div>
                <Div>
                        <span className="nu_Semi_Bold">
                    3. Открытые спойлеры без обозначения.
                </span>
                </Div>
                <Div>
                        <span className="nu_Semi_Bold">
                    4. Прямая и косвенная конфронтация через сообщения.
                </span>
                </Div>
                <br/>
                <Div>
                        <span className="nu_Semi_Bold">
                   Все права на регуляцию действий пользователей находятся у администраторов и модераторов приложения.
                </span>
                </Div>
            </Div>
            {/* <Div style={{marginTop: 20}}>
                <Title className="nu_Extra_Bold"
                       level={2}>В комментариях запрещены:</Title>
                <Div>
                        <span className="nu_Semi_Bold">
                    1. Оскорбления любых лиц, в том числе лиц, не участвующих в дискуссии.
                </span>
                    <p style={{marginTop: 20}} className="nu_Semi_Bold">
                        Запрещены оскорбления в сторону кого-либо.

                        Под данный пункт попадают комментарии, содержащие:

                        Прямые оскорбления личности, родственников человека, этнической принадлежности и/или
                        политических взглядов;
                        Завуалированные оскорбления, а также оскорбления на других языках;
                        Оскорбительные вопросы.
                    </p>
                    <span className="nu_Semi_Bold">
                    2. Бессмысленные коментарии / Флуд / Оффтоп
                </span><br/>
                    &ensp;&ensp;<span className="nu_Semi_Bold">
                    2.1 Бессмысленные коментарии.
                </span>

                    <p style={{marginTop: 20}} className="nu_Semi_Bold">
                        Под данный пункт попадают следующие коментарии:

                        Комментарии, имеющие слабую смысловую нагрузку, мешающие обсуждению темы и/или комментарии, которые можно расценить как оффтоп;
                        Комментарии, которые возможно заменить системной оценкой произведения (Пример: 5/5, класс, и тому подобные);
                        Бессмысленные наборы символов.
                        Запрещены комментарии, по сути своей содержащие предложение: "Сообщите, когда выйдет глава; Пните, когда глава; Скажите, когда глава; и подобные". Для этого у нас существует функционал подписок на обновления и уведомлений, в том числе, в личные сообщения ВКонтакте, пожалуйста, пользуйтесь им и не засоряйте комментарии.
                    </p>
                    &ensp;&ensp;<span className="nu_Semi_Bold">
                    2.2 Флуд
                </span>
                    <p style={{marginTop: 20}} className="nu_Semi_Bold">
                        Под данный пункт попадают:

                        Однотипные сообщения за относительно короткий промежуток времени;                    </p>
                    <span className="nu_Semi_Bold">
                    3. Спойлеры
                </span>
                    <p style={{marginTop: 20}} className="nu_Semi_Bold">
                        Под данный пункт попадают сообщения, не помеченные как спойлер, но содержащие таковой.

                        За нарушение данного пункта комментарий помечается спойлером, а комментатору выдаётся предупреждение. За многочисленные нарушения данного пункта может последовать блокировка.

                        Спойлеры, написанные под каким-либо произведением, но относящиеся к другому, удаляются, а также могут быть рассмотрены как попытка обхода правил.
                    </p>
                    <span className="nu_Semi_Bold">
                    4. Конфликты / Провокации на них
                </span>
                    <p style={{marginTop: 20}} className="nu_Semi_Bold">
                        Запрещены споры на темы религии, политики, идеологий и прочих мировоззрений.

                        Так же запрещены сообщения, которые можно расценить как провокацию какой-либо группы общества.                    </p>
                </Div>

            </Div>*/}

        </Panel>
    )
}
export default Rules;