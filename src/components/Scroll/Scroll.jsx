import {Link} from "react-scroll"
function Scroll(props) {

    return (
        <div className="fixed bottom-10 right-10 z-10">
            <Link
                to="block2"
                spy={true}
                smooth={true}
                duration={500}
                className="block mb-4 text-blue-500 hover:text-blue-700 cursor-pointer"
            >
                Прокрутить к Блоку 2
            </Link>
            <Link
                to="block3"
                spy={true}
                smooth={true}
                duration={500}
                className="block text-blue-500 hover:text-blue-700 cursor-pointer"
            >
                Прокрутить к Блоку 3
            </Link>
        </div>
    );
}

export default Scroll;