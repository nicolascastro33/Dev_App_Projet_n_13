
interface LoginViewProps {
    loginSubmit(e:any): void
    wrongPasswordOrEmail: boolean
}


function LoginView({loginSubmit, wrongPasswordOrEmail}: LoginViewProps) {
    return (
        <main className="main bg-dark">
          <section className="sign-in-content">
            <i className="fa fa-user-circle sign-in-icon" />
            <h1>Sign In</h1>
            <form onSubmit={loginSubmit}>
              <div className="input-wrapper">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" />
              </div>
              <div className="input-wrapper">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" />
              </div>
              <div className="input-remember">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="remembeMe">Remember me</label>
              </div>
        
              {/* <!-- SHOULD BE THE BUTTON BELOW --> */}
              <button className="sign-in-button">Sign In</button>
              {wrongPasswordOrEmail && 
                <p className="error-password-or-email">Wrong password or email</p>
              }
            </form>
          </section>
        </main>
    )
  }
  
  export default LoginView
  