
import * as React from "react";
import "./SplashScreen.css";
import logo from '../assets/images/logo.svg';

export class SplashScreen extends React.Component<any, any> {

    public splashFadeRef: React.RefObject<any>;
    public splashLoadRef: React.RefObject<any>;

    constructor(props: any) {
        super(props);

        this.state = {
            isComplete: false,
            displayMode: "flex",
        };
        this.splashFadeRef = React.createRef();
        this.splashLoadRef = React.createRef();
    }


    public fadeOut() {
        if (this.state.isComplete) { return; }

        console.log('Splash fadeOut');

        const splashFade = this.splashFadeRef.current;
        splashFade.classList.toggle('app-splash-fadeOut');

        const splashLoad = this.splashLoadRef.current;
        splashLoad.classList.toggle('app-splash-fadeOut');

        this.setState({ isComplete: true});
    }

    public onFadingStart = () => {
        console.log('Splash onFadingStart');
    };

    public onFadingEnd = () => {
        console.log('Splash onFadingEnd');
        this.setState({
          isComplete: true,
          displayMode: "none",
        });
      };

    public onProgressStart = () => {
        console.log('Splash onProgressStart');
    };
    public onProgressEnd = () => {
        console.log('Splash onProgressEnd');
        this.fadeOut();
    };

    render() {
        // className={`app-splash-loading ${this.props.classNames}`}
        let splashMode = { display: this.state.displayMode };
        let splashProgress = this.state.isComplete ? { width: "100%" } : { } ;

        return (
            <div className="app-splash-root" style={splashMode}>
                <div className="app-splash-fade" ref={this.splashFadeRef}
                onAnimationStart={this.onFadingStart}
                onAnimationEnd={this.onFadingEnd}/>

                <div className="app-splash-loading" ref={this.splashLoadRef}>
                    <div className="app-splash-center">
                        <div className="app-splash-logo">
                            <img className="app-splash-logo-image" src={logo}/>
                            {/* <div className="app-splash-logo-plat">for React</div>  */}
                        </div>
                        <div className="app-splash-progress">
                            <div className="app-splash-progress-info"  >
                             COVID-19 Dashboard - React Application
                            </div>
                            <div className="app-splash-progress-bar" style={splashProgress}
                            onAnimationStart={this.onProgressStart}
                            onAnimationEnd={this.onProgressEnd}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
