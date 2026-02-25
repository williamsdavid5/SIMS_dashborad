import './styles/modalImg.css'
import ImagemExemplo from '../assets/cameraImagemExemplo.jpg'
import { useEffect } from 'react'

export default function ModalImg({ setModalImagem, dadosOcorrencia }) {
    useEffect(() => {
        console.log(dadosOcorrencia);
    }, dadosOcorrencia)

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleString("pt-BR");
    };

    return (
        <>
            <div className='modalBackground'>
                <main className='janelaModal'>
                    <div className='topoModal'>
                        <p><b>{formatarData(dadosOcorrencia.data)}</b></p>
                        <p>{dadosOcorrencia.camera}</p>
                        <p><b>Item envolvido: </b>{dadosOcorrencia.item}</p>
                        <button onClick={() => setModalImagem(false)} className='botaoFecharModal'>Fechar</button>
                    </div>
                    <div className='auxImagem'>
                        <img src={ImagemExemplo} alt="" />
                    </div>
                </main>
            </div>
        </>
    )
}