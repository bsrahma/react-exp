import {useState, useEffect} from "react";
import {
  useParams,
  useNavigate,
} from 'react-router-dom';
import styles from './Character.module.css';
import { ICharacter } from './interfaces';

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export default function Character() {
  const params = useParams<{ id?: string}>();
  const { id } = params;
  const [character, updateCharacter] = useState({} as ICharacter);
  useEffect(() => {

    async function request() {
      const res = await fetch(`${defaultEndpoint}/${id}`);
      const data = await res.json();

      updateCharacter({
        ...data,
      });
    }

    request();
  }, [id]);

  
  const navigate = useNavigate();
  const { name, image, gender, location, origin, species, status } =  character;
  return (
    <div className={styles.container}>
      <main>
        <h1 className={styles.title}>Character Details</h1>
        <div className={styles.profile}>
          <div className={styles.profileImage}>
            <img src={image} alt={name} />
          </div>
          <div className={styles.profileDetails}>
            {status && (
              <button
                className={`${styles.profileStatus} ${
                  status === 'Alive'
                    ? styles.statusAlive
                    : status === 'Dead'
                    ? styles.statusDead
                    : styles.statusUnknown
                }`}
              >
                {status}
              </button>
            )}
            <ul>
              <li>
                <strong>Name:</strong> {name}
              </li>
              <li>
                <strong>Gender:</strong> {gender}
              </li>
              <li>
                <strong>Species:</strong> {species}
              </li>
              <li>
                <strong>Location:</strong> {location?.name}
              </li>
              <li>
                <strong>Originally From:</strong> {origin?.name}
              </li>
            </ul>
          </div>
        </div>
        <p className={styles.back}>
        <button onClick={() => navigate(-1)}>← Back to All Characters</button>
        </p>
      </main>
    </div>
  );
}
