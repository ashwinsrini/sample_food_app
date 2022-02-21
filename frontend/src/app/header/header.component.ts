import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  model: any = {
    username: '',
    password: '',
  }
  loginModel: any = {
    username: '',
    password: '',
  }
  isNetworkRequested: Boolean = false;
  cartCount = 0;
  isLoggedIn: Boolean = false;
  loginRes: any;
  registerRes: any;

  constructor(
    public homeServ: HomeService,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated();
    this.homeServ.getCartRefresh().subscribe(res => {
      this.setCartCount();
    });
  }

  isAuthenticated() {
    let auth = this.homeServ.getLoggedInUser();
    if (auth) {
      this.isLoggedIn = true;
      if (this.isLoggedIn) {
        this.setCartCount();
      }
    }
  }

  setCartCount() {
    let cartData;
    cartData = this.homeServ.getCartData();
    if (cartData) {
      this.cartCount = cartData.length;
    }
  }

  onRegister(form: any) {
    if (!form.value.username || !form.value.password) {
      this.registerRes = "Username and Password is required!";
    }
    if (form.valid) {
      this.isNetworkRequested = true;
      this.homeServ.register(this.model).subscribe(res => {
        if (res.code != 200) {
          this.isNetworkRequested = false;
          this.registerRes = res.message;
        } else {
          $('#registerModal').modal('hide');
          this.registerRes = null;
          this.isNetworkRequested = false;
          this.toastr.success('User Created Successfully!', 'Sign Up!');
        }
      });
    }
  }

  onLogin(form: any) {
    if (!form.value.username || !form.value.password) {
      this.loginRes = "Username and Password is required!";
    }
    if (form.valid) {
      this.isNetworkRequested = true;
      this.homeServ.login(this.loginModel).subscribe(res => {
        form.resetForm();
        if (res.code != 200) {
          this.isNetworkRequested = false;
          this.loginRes = res.message;
        } else {
          $('#loginModal').modal('hide');
          this.loginRes = null;
          this.isAuthenticated();
          this.isNetworkRequested = false;
          this.toastr.success('Signedin Successfully!', 'Sign In!');
        }
      });
    }
  }

}
