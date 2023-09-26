import React from 'react';
import styles from "./terms.module.scss"
function Terms(props) {
    return (
        <div className={styles.termsWrap}>
            <div className={"flex justify-end"}>{props.children}</div>
            <h1 className={"text-xl text-center"}>User Agreement Terms.</h1>
            <ul className={"list-decimal break-words"}>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores ducimus expedita laboriosam nisi praesentium quam quo suscipit. Dolores, facilis, natus?</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad animi eos harum ipsum odit officia sapiente sint totam velit. Error illum laboriosam neque voluptas. Id laudantium nesciunt obcaecati voluptate?</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi deleniti dicta, dolorum eius eveniet impedit ipsam ipsum, libero magnam maiores numquam perspiciatis quam rerum sit!</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum deleniti ea est eum eveniet harum incidunt labore laboriosam laudantium maiores nobis nostrum odit, porro sit sunt suscipit ut vero voluptatem! Ab, at harum laudantium molestias quos tenetur ullam vero voluptatum?</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At, culpa dolores maxime officia recusandae veritatis.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus ea hic laboriosam maxime minus quas ratione? Eligendi, exercitationem.</li>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad commodi cum debitis facere facilis illo incidunt iste laudantium maiores modi non officia, placeat reprehenderit rerum similique tempora velit veritatis voluptates? Alias earum iusto magni natus numquam odio optio temporibus, unde! Amet cum earum est porro tempora tenetur! Aliquam, cupiditate, veritatis.</li>
            </ul>
        </div>
    );
}

export default Terms;