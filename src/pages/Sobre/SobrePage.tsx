import { useNavigate } from "react-router-dom";
import styles from "./sobre.module.css";
import logo from "../../assets/images/logo.png"; // Reuse logo
import { Header } from "../../components/Commons/Header/Header";
import { Main } from "../../components/Commons/Main/Main";

export const SobrePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Header
        onBack={() => navigate(-1)}
      >
        <span style={{ color: "white", fontWeight: 700 }}>Sobre</span>
      </Header>
      <Main className={styles.content}>
        <section>
          <h2>Sobre o Aplicativo</h2>
          <p>
            O Ponto Certo é um aplicativo desenvolvido para auxiliar a
            Secretaria de Transporte e Mobilidade (SEMOB/SUTER) no mapeamento e
            cadastro de pontos de parada de ônibus no Distrito Federal. O app
            permite que agentes de campo registrem com precisão os locais de
            parada, incluindo informações como:
          </p>
          <ul>
            <li>Localização GPS da parada</li>
            <li>Identificação da via relacionada</li>
            <li>Existência de abrigo no ponto</li>
            <li>Condições de acessibilidade</li>
            <li>Inserção de imagens</li>
          </ul>
          <p>
            Com funcionalidades como visualização em mapa com camadas de
            satélite, filtros por Região Administrativa ou Bacia, e envio de
            dados para o sistema central, o aplicativo garante uma coleta de
            dados eficiente e organizada para a gestão de infraestrutura de
            transporte público.
          </p>
          <p>
            Este app é parte do esforço de modernização e digitalização dos
            serviços públicos de mobilidade urbana do DF.
          </p>
        </section>

        <section>
          <h2>Equipe de Desenvolvimento</h2>
          <div className={styles.card}>Adalberto Carvalho Santos Júnior</div>
          <div className={styles.card}>Ednardo de Oliveira Ferreira</div>
          <div className={styles.card}>Gabriel Pedro Veras</div>
        </section>

        <section className={styles.logoSection}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </section>
      </Main>
    </div>
  );
};
