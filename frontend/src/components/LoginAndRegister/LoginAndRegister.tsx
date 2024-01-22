import PropTypes from 'prop-types';
import styles from '../../styles/LoginAndRegister.module.scss'
import { FormEvent, useContext, useState } from 'react';
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { emailPattern, namePattern, passwordPattern, userNamePattern } from '../../utils/regex';
import { useMutation } from '@tanstack/react-query'
import { fetchLoginAndRegister } from '../../api/auth/loginAndRegister';
import { toast } from 'react-toastify';
import { UserContext, useUserLoading } from '@/hooks/ContextProvider';
import { LoadingComponent } from '../LoadingComponent'

export const LoginAndRegister = () => {
    const [type, setType] = useState('Login')
    const [inputValues, setInputValues] = useState({ name: "", email: "", password: "", password2: "", userName: "" })
    const [uiUpdates, setUichanges] = useState({ checks: false, password: true, password2: false })
    const userData = useContext(UserContext)
    const loading = useUserLoading()

    const LoginandRegisterMutation = useMutation({
        mutationKey: [type],
        mutationFn: () => fetchLoginAndRegister(type, inputValues),
        onSuccess: (data) => {

            if (data.status && data.status === "success") {
                toast.info('Welcome ' + data.user.name)

                if (userData?.DispatchUser) {
                    userData.DispatchUser({ type: 'addUser', payload: data.user })
                }
            } else {
                toast.warning(data.message)
            }
        }
    })
    if (loading) {
        return <LoadingComponent />
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!uiUpdates.checks) setUichanges((prev) => ({ ...prev, checks: true }))
        if (type === "Register") {
            if (nameCheck && EmailCheck01 && PasswordCheck && PasswordCheck02 && userNameCheck) {
                LoginandRegisterMutation.mutate()
            } else {
                toast.error("Please check - " + (!nameCheck ? "Name " : "") + (!userNameCheck ? "UserName " : "") + (!EmailCheck01 ? "Email " : "") + (!PasswordCheck ? "Password " : "") + (!PasswordCheck02 ? "Password 2" : ""))
            }
        } else if (type === "Login") {
            if (EmailCheck01 && PasswordCheck) {
                LoginandRegisterMutation.mutate()
            } else {
                toast.error("Please check - " + (!EmailCheck01 ? "Email " : "") + (!PasswordCheck ? "Password " : ""))
            }
        }
    }

    const handleEye = (ref: number) => {
        if (ref == 1) {
            setUichanges((prev) => ({ ...prev, password: !uiUpdates.password }))
        } else if (ref == 2) {
            setUichanges((prev) => ({ ...prev, password2: !uiUpdates.password2 }))
        }
    }
    const handlePageChange = () => {
        if (type === "Register") {
            setType('Login')
        } else {
            setType('Register')
        }
        setInputValues({ name: "", email: "", password: "", password2: "", userName: "" })
        setUichanges({ checks: false, password: true, password2: false })
    }
    let nameCheck = namePattern.test(inputValues.name);
    let userNameCheck = userNamePattern.test(inputValues.userName);
    let EmailCheck01 = emailPattern.test(inputValues.email);
    let PasswordCheck = passwordPattern.test(inputValues.password)
    let PasswordCheck02 = inputValues.password === inputValues.password2 && inputValues.password2.length > 3;

    return (
        <div className={styles.LoginAndRegisterBox}>
            <form className={styles.LoginAndRegisterForm} onSubmit={handleSubmit}>
                <div className={styles.title}>
                    {type}
                </div>
                <div className={styles.description}>
                    Hey, Enter your details to get {type} to your account
                </div>
                <div className={styles.content}>
                    {type === "Register" &&
                        <>
                            <div className={styles.InputBox}>
                                <label htmlFor="nameInput" className={styles.inputLabel}>Name</label>
                                <input type="text" id='nameInput' className={styles.input} value={inputValues.name} placeholder='Enter Your Name'
                                    onChange={(e) => setInputValues((prev) => ({ ...prev, name: e.target.value }))}
                                />
                                {uiUpdates.checks && !nameCheck &&
                                    <div className={styles.warning}>one or two words, no extra spacing & between 5 to 30 characters only.</div>}
                            </div>
                            <div className={styles.InputBox}>
                                <label htmlFor="userNameInput" className={styles.inputLabel}>UserName</label>
                                <input type="text" id='userNameInput' className={styles.input} value={inputValues.userName} placeholder='Enter Your UserName'
                                    onChange={(e) => setInputValues((prev) => ({ ...prev, userName: e.target.value }))}
                                />
                                {uiUpdates.checks && !userNameCheck &&
                                    <div className={styles.warning}>one words, lowercase and digit, no extra spacing & between 5 to 20 characters only.</div>}
                            </div>
                        </>}
                    <div className={styles.InputBox}>
                        <label htmlFor="emailInput" className={styles.inputLabel}>Email</label>
                        <input type="email" id='emailInput' className={styles.input} value={inputValues.email} placeholder='Enter Email'
                            onChange={(e) => setInputValues((prev) => ({ ...prev, email: e.target.value }))}
                        />
                        {uiUpdates.checks && !EmailCheck01 &&
                            <div className={styles.warning}>min of 3 and a max of 40 characters @ total 50.</div>}
                    </div>
                    <div className={styles.InputBox}>
                        <label htmlFor="passwordInput" className={styles.inputLabel}>Password</label>
                        <input type={uiUpdates.password ? "password" : "text"} id='passwordInput' className={styles.input + " " + styles.passwordInput} value={inputValues.password} placeholder='Enter Password'
                            onChange={(e) => setInputValues((prev) => ({ ...prev, password: e.target.value }))}
                        />
                        <div className={styles.eyeIcon} onClick={() => handleEye(1)}>{uiUpdates.password ? <IoMdEyeOff /> : <IoMdEye />}</div>
                        {uiUpdates.checks && !PasswordCheck &&
                            <div className={styles.warning}>no Spacing, atleast contain one capital, small letter, number and one from @, &, *, #, $, !, ? and limit of 3 to 20.</div>}
                    </div>
                    {type === "Register" &&
                        <div className={styles.InputBox}>
                            <label htmlFor="passwordInput2" className={styles.inputLabel}>Password Again</label>
                            <input type={uiUpdates.password2 ? "password" : "text"} id='passwordInput2' className={styles.input + " " + styles.passwordInput} value={inputValues.password2} placeholder='Enter Password Again'
                                onChange={(e) => setInputValues((prev) => ({ ...prev, password2: e.target.value }))}
                            />
                            <div className={styles.eyeIcon} onClick={() => handleEye(2)}>{uiUpdates.password2 ? <IoMdEyeOff /> : <IoMdEye />}</div>
                            {uiUpdates.checks && !PasswordCheck02 &&
                                <div className={styles.warning}>Both the Password should be same.</div>}
                        </div>
                    }
                </div>
                <div className={styles.SubmitBox}>
                    <button className={styles.submitButton} disabled={LoginandRegisterMutation.isPending} type='submit'>
                        {LoginandRegisterMutation.isPending ? "Loading" : type === 'Register' ? 'sign in' : 'log in'}
                    </button>
                </div>
                <div className={styles.changePage}>
                    {type !== 'Register' ? `Don't have account sign in ` : `Already have account log in `}
                    <p className={styles.changePageLink} onClick={handlePageChange}>here</p>
                </div>
            </form>
        </div>
    )
}