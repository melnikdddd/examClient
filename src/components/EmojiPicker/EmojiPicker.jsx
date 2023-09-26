import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data"
import {useState} from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

function EmojiPicker(props) {

    const innerWidth = useWindowDimensions().width;
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    return (
        <div className={"absolute"} style={{top: props.top, left: props.left}} onMouseLeave={props.onMouseLeave}>
            <Picker data={data}
                    onEmojiSelect={props.handleEmojiSelect}
                    previewPosition={"none"}
                    skinTonePosition={"none"}
                    dynamicWidth={!(innerWidth > props.adaptiveWidth)}
            />
        </div>
    );
}

export default EmojiPicker;