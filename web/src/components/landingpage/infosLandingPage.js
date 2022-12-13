import React from 'react';
import { ReactComponent as IbmLogo } from '../../images/ibm-logo.svg';
import { ReactComponent as VtexLogo } from '../../images/VTEX-Brand.svg';
import { ReactComponent as MicrossoftLogo } from '../../images/microsoft-logo.svg';
import { ReactComponent as ToptalLogo } from '../../images/Toptal-Logo.svg';

export default function InfoslLandingPage() {
  return (
    <div>
      <div className="landing-container-description text-start">
        <h1 className="fs-1 fw-bold mb-5 text-center">Chegou a hora</h1>
        <p className="fs-2 px-auto py-3">
          Quem diria que um dia eu fosse dar uma festa de despedida, quanta coisa aconteceu para
          chegar no que está acontecendo hoje.
        </p>
        <p className="fs-2 px-auto py-3">
          Depois de quase 2 anos de espera, finalmente está chegando a hora da partida, e com isso
          teremos que comemorar esse encerramento de ciclo da melhor forma possível.
        </p>
        <p className="fs-2 px-auto py-3">
          Voce está prestes a ter uma noite inesquecível, regada a muito álcool e diversão, está
          expressamente proíbido ficar parado neste dia.
        </p>
        <p className="fs-2 px-auto py-3">
          Para que tudo dê certo, fique atendo as informações abaixo!
        </p>
      </div>
      <div className="landing-container bg-white text-secondary mx-auto">
        <div className="text-start px-auto py-3">
          <h3 className="landing-title">Local</h3>
          <p className="fs-4 py-3">
            Escolhemos este local pois o Espaço Mocambo é uma Casa de Festas localizada a 5 minutos
            do final da Asa Norte! Ambiente perfeito para fazermos aquela baguncinha
          </p>
          <p className="fs-4 py-3">
            St. de Habitações Individuais Norte Trecho 1 Lago Norte, Brasília - DF, 71560-100
          </p>
        </div>
        <img className="landing-image" src="/images/mocambo.png" />
      </div>
      <div className="landing-container">
        <img className="landing-image" src="../../images/bebida.png"></img>
        <div className="text-start px-auto py-5">
          <h3 className="landing-title">Open Bar</h3>
          <p className="fs-4 py-3">
            Isso mesmo que você acabou de ler! Contaremos com um open bar de gin, vodka, Redbull e
            Frutas para tomarmos os melhores drinks que essa Brasília já viu
          </p>
          <h4 className="text-uppercase fw-bold">Atenção:</h4>
          <p className="fs-4 py-3">
            <span className="fw-bold text-uppercase">Não</span> irá ter cerveja no open bar, mas
            fique mais do que livre para levar seu suco de cevada (você que irá cuidar disso). Para
            aqueles não irão beber, teremos refrigerente e água 😔
          </p>
        </div>
        <div></div>
      </div>
      <div className="landing-container bg-white text-secondary">
        <div className="text-start px-auto py-5">
          <h3 className="landing-title">Comida</h3>
          <p className="fs-4 py-3">
            <span className="fw-bold text-uppercase">Não</span> iremos ter comida no local, é
            responsabilidade de cada um já vir comido. A ceia de natal já é no dia seguinte
          </p>
          <p className="fs-4 py-3">
            Está liberado levar sua própria comida, mas cuidado pro amiguinho não comer.
          </p>
          <p className="fs-4 py-3">
            Também há a possibilidade de pedir comida para lá, vai ser tranquilo pro pessoa dos
            aplicativos
          </p>
        </div>
        <div>
          <img className="landing-image" src="../../images/comida.png"></img>
        </div>
      </div>
      <div className="landing-container">
        <img className="landing-image" src="../../images/dance.png"></img>
        <div className="text-start px-auto py-5">
          <h3 className="landing-title">Música</h3>
          <p className="fs-4 py-3">
            O foco de música dessa despedida é o FUNK, então podem ir preparando as dancinhas porque
            vamos descer até o chão
          </p>
          <p className="fs-4 py-3">
            Podem ficar tranquilos que tocaremos de tudo: Sertanejo, piseiro, eletrônica e por aí
            vai
          </p>
          <p className="fs-4 py-3">
            Contaremos com a presença de 2 dos melhores DJs que o planeta terra já presenciou
          </p>
        </div>
        <div></div>
      </div>
      <div className="landing-container bg-white text-secondary">
        <div className="text-start px-auto py-5">
          <h3 className="landing-title">Ingresso</h3>
          <p className="fs-4 py-3">
            Não esqueça do seu ingresso e documento com foto no dia da despedida, esse será seu
            único meio para conseguir embarcar nessa viagem
          </p>
          <p className="fs-4 py-3">
            Só relembrando que não pode levar o amiguinho, terá segurança na porta para a checagem
            dos ingressos, vamos evitar problemas!
          </p>
        </div>
        <div>
          <img className="landing-image" src="../../images/mocambo.png"></img>
        </div>
      </div>
      <div className="landing-container flex-column text-center">
        <p className="fs-4">Patrocinadores:</p>
        <div className="d-flex justify-content-center">
          <IbmLogo width="100px" height="100px" className="mx-3" />
          <VtexLogo width="100px" height="100px" className="mx-3" />
          <MicrossoftLogo width="100px" height="100px" className="mx-3" />
          <ToptalLogo width="100px" height="100px" className="mx-3" />
        </div>
      </div>
    </div>
  );
}
