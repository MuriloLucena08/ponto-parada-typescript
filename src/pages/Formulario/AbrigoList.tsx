import { IAbrigo } from '../../types/Ponto';
import styles from './formulario.module.css';
import { ABRIGO_TYPES } from '../../data/abrigoTypes';

interface Props {
    abrigos: IAbrigo[];
    setAbrigos: (val: IAbrigo[]) => void;
}

const AbrigoList = ({ abrigos, setAbrigos }: Props) => {

    const addAbrigo = () => {
        setAbrigos([...abrigos, {
            idTipoAbrigo: undefined,
            temPatologia: false,
            imgBlobPaths: [],
            imagensPatologiaPaths: []
        }]);
    };

    const removeAbrigo = (index: number) => {
        const newAbrigos = [...abrigos];
        newAbrigos.splice(index, 1);
        setAbrigos(newAbrigos);
    };

    const updateAbrigo = (index: number, field: keyof IAbrigo, value: any) => {
        const newAbrigos = [...abrigos];
        newAbrigos[index] = { ...newAbrigos[index], [field]: value };
        setAbrigos(newAbrigos);
    };

    return (
        <div className={styles.abrigosSection}>
            <div className={styles.headerRow}>
                <h3>Abrigos ({abrigos.length})</h3>
                <button onClick={addAbrigo} className={styles.addButton}>+ Adicionar Abrigo</button>
            </div>

            {abrigos.map((abrigo, index) => (
                <div key={index} className={styles.abrigoCard}>
                    <div className={styles.cardHeader}>
                        <span>Abrigo #{index + 1}</span>
                        <button onClick={() => removeAbrigo(index)} className={styles.removeBtn}>✕</button>
                    </div>

                    <div className={styles.cardBody}>
                        {/* Type Selector */}
                        <div className={styles.field}>
                            <label>Tipo de Abrigo</label>
                            <select
                                value={abrigo.idTipoAbrigo || ''}
                                onChange={(e) => updateAbrigo(index, 'idTipoAbrigo', parseInt(e.target.value))}
                                className={styles.select}
                            >
                                <option value="">Selecione...</option>
                                {ABRIGO_TYPES.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Picker */}
                        <div className={styles.field}>
                            <label>Fotos do Abrigo</label>
                            <ImagePicker
                                images={abrigo.imgBlobPaths}
                                onImagesChange={(imgs) => updateAbrigo(index, 'imgBlobPaths', imgs)}
                            />
                        </div>

                        {/* Pathology */}
                        <div className={styles.fieldRow}>
                            <span>Possui Patologia?</span>
                            <input
                                type="checkbox"
                                checked={abrigo.temPatologia}
                                onChange={(e) => updateAbrigo(index, 'temPatologia', e.target.checked)}
                                className={styles.checkbox}
                            />
                        </div>

                        {abrigo.temPatologia && (
                            <div className={styles.field}>
                                <label>Fotos da Patologia</label>
                                <ImagePicker
                                    images={abrigo.imagensPatologiaPaths}
                                    onImagesChange={(imgs) => updateAbrigo(index, 'imagensPatologiaPaths', imgs)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ImagePicker = ({ images, onImagesChange }: { images: string[], onImagesChange: (imgs: string[]) => void }) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newUrls = files.map(f => URL.createObjectURL(f)); // Create blob URLs
            onImagesChange([...images, ...newUrls]);
        }
    };

    const removeImage = (idx: number) => {
        const newImages = [...images];
        newImages.splice(idx, 1);
        onImagesChange(newImages);
    };

    return (
        <div className={styles.imagePicker}>
            <div className={styles.imageList}>
                {images.map((img, idx) => (
                    <div key={idx} className={styles.thumb}>
                        <img src={img} alt="thumb" />
                        <button onClick={() => removeImage(idx)} className={styles.removeImg}>×</button>
                    </div>
                ))}
            </div>
            <label className={styles.uploadBtn}>
                📷 Adicionar Foto
                <input type="file" accept="image/*" multiple onChange={handleFile} hidden />
            </label>
        </div>
    );
};

export default AbrigoList;
