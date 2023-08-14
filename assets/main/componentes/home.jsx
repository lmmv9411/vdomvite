export const Home = (props) => {
    return (
        <section>
            <header>
                <h4>{props.titulo}</h4>
            </header>
            <article>
                <p>{props.parrafo}</p>
            </article>
        </section>
    )
}