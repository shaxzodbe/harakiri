import {getClassName} from "@vkontakte/vkui";
import {parse} from "query-string";

class Helper {
    getNameOfBorder = (id) => {
        let d = [
            "avatar_gray",
            "avatar_orange",
            "avatar_white",
            "avatar_yellow",

            "avatar_almaz",
            "orange_gradient",
            "avatar_izumrd",
            "scen_av",
            "taiper_av",
            "designer_av",

            "top_gradient_purpl",
            "orange_gradient",
            "pink_gradient",
        ]
        return d[id]
    };

    static getColorForTheme(theme) {

        return getClassName('text-color', theme);
    }
    static getNormalWordBall(count){

        let stringCount = String(count);
        if(stringCount.length === 1){
            if(count === 0)
                return "баллов"
            else if(count === 1)
                return "балл"
            else if(count >= 2 && count <= 4)
                return "балла"
            else if(count >= 5)
                return "баллов"
        }else{
            let char = parseInt(stringCount[1]);
            if(count <= 20)
                return "баллов"
            if(char === 0)
                return "баллов"
            else if(char === 1)
                return "балл"
            else if(char >= 1 && count <= 4)
                return "балла"
            else if(char >= 5)
                return "баллов"
        }
    }
    static rus_to_latin(str) {
        var ru = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
            'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
            'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
            'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya','ь':"*"
        }, n_str = [];

        str = str.replace(/[ъ]+/g, '').replace(/й/g, 'i');

        for (var i = 0; i < str.length; ++i) {
            if (str[i] === " ")
                n_str.push("_")
            else
                n_str.push(
                    ru[str[i]]
                    || ru[str[i].toLowerCase()] == undefined && str[i]
                    || ru[str[i].toLowerCase()].toUpperCase()
                );
        }

        return n_str.join('');
    }
    static latin_to_rus(str) {
        var ru = {
            'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д',
            'e': 'е',  'j': 'ж', 'z': 'з', 'i': 'и',
            'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о',
            'p': 'п', 'r': 'р', 's': 'с', 't': 'т',
            'f': 'ф', 'h': 'х', 'c': 'ц', 'ch': 'ч', 'sh': 'ш',
            'shch': 'щ', 'y': 'ы', 'u': 'ю', 'ya': 'я',"*":'ь'
        }, n_str = [];

        str = str.replace(/i/g, 'й').replace(/u/g, 'у');

        for (var i = 0; i < str.length; ++i) {
            if (str[i] === "_")
                n_str.push(" ")
            else
                n_str.push(
                    ru[str[i]]
                    || ru[str[i].toLowerCase()] == undefined && str[i]
                    || ru[str[i].toLowerCase()].toUpperCase()
                );
        }

        return n_str.join('');
    }

    static getBackGroundForTheme(theme) {
        return getClassName('background_color', theme);
    }

    static getNormalDate(when_created) {
        when_created = new Date(when_created);
        let day = when_created.getDate()
        let month = when_created.getMonth()
        let year = when_created.getFullYear()

        month = String(month + 1).length === 1 ? "0" + (month + 1) : month + 1

        day = String(day).length === 1 ? "0" + day : day
        return `${day}.${month}.${year}`
    }


    getFont(font, bold) {
        let k = []
        switch (font) {
            case "Sansa":
                k = [
                    "open_sans_Semi_Bold",
                    "open_sans_Bold",
                    "open_sans_Extra_Bold",
                ]
                return k[bold]
            case "Roboto":
                k = [
                    "roboto_semi_bold",
                    "roboto_bold",
                    "roboto_extra_bold",
                ]
                return k[bold]
            case "Noto":
                k = [
                    "noto_extra_bold",
                    "noto_bold",
                    "noto_semi_bold",
                ]
                return k[bold]
            case "Roboto Slab":
                k = [
                    "roboto_slab_extra_bold",
                    "roboto_slab_bold",
                    "roboto_slab_semi_bold",
                ]
                return k[bold]
            case "Merriweather":
                k = [
                    "merriweather_extra_bold",
                    "merriweather_bold",
                    "merriweather_semi_bold",
                ]
                return k[bold]
            case "Playfair Display":
                k = [
                    "playfair_display_extra_bold",
                    "playfair_display_bold",
                    "playfair_display_semi_bold",
                ]
                return k[bold]
            case "Lora":
                k = [
                    "lora_extra_bold",
                    "lora_bold",
                    "lora_semi_bold",
                ]
                return k[bold]
            case "Nunito":
                k = [
                    "nu_Extra_Bold",
                    "nu_Bold",
                    "nu_Semi_Bold",
                ]
                return k[bold]
        }
    }
}


export default Helper;