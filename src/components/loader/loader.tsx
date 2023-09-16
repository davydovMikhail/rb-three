import styles from "../../styles/loader.module.css"
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";

const Loader = () => {
    const {loader, notification, showOK} = useTypedSelector(state => state.main);
    const { SetNotification, SetLoader, SetShowOk } = useActions();

    function handleOk() {
            SetNotification('');
            SetLoader(false);
            SetShowOk(false);
    }

    return (
      <>
        {loader &&
          <div className={styles.preloader}>
              <div className={styles.preloader__loader}>
              </div>
              <h4 className={styles.preloader__msg}>{notification}</h4>
              {showOK && 
                <button onClick={() => handleOk()} className={styles.preloader__btn + " " + "btn btn-warning btn-lg"}>OK</button>
              }
          </div>
        }
      </>
    );
  };
  
export default Loader;