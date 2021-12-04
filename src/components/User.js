import React from "react"
import {Avatar, Subhead} from "@vkontakte/vkui";
import Helper from "./Helper";
import Api from "../controllers/Api";

const User = ({item,onClick,avatar=true}) =>{
    const HelperD = new Helper();
    return(
        <div onClick={()=>onClick(item)} className="people_info">
            <div className={avatar ? `avatarBorder ${item && item.hasOwnProperty("avatar_border") ?
                HelperD.getNameOfBorder(item.avatar_border) : HelperD.getNameOfBorder(0)}` : ``}>

                <Avatar size={54} className={"avatar_people"}
                        src={avatar ? item.photo_100 : item.hasOwnProperty("photo") && (Api.imgUrl + "/" + item.photo)}/>
            </div>

            <Subhead style={{textAlign: "center", marginTop: 2, marginBottom: 2}}
                     className={"nu_Semi_Bold articleName"} level="3"
                     weight="regular">{avatar ? `
                     ${String(`${item.first_name} ${item.last_name}`).length > 15 ? 
                String(`${item.first_name} ${item.last_name}`).substring(0,15) : `${item.first_name + " " +item.last_name}`} ` : item.name.length > 15 ? item.name.substring(0,15) : item.name}</Subhead>
            {avatar &&
            <Subhead className={"nu_Semi_Bold"} weight="regular"
                     style={{color: "#99A2AD"}}>{item.role}</Subhead>
            }

        </div>
    )
}
export default User