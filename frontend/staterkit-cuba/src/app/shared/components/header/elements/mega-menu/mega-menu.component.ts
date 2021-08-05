import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../../../services/nav.service';

@Component({
  selector: 'app-mega-menu',
  templateUrl: './mega-menu.component.html',
  styleUrls: ['./mega-menu.component.scss']
})
export class MegaMenuComponent implements OnInit {

  public megaItems: Menu[];
  public levelmenuitems: Menu[];
  
  constructor(public navServices: NavService) { 
    this.navServices.megaItems.subscribe(megaItems => this.megaItems = megaItems);
    this.navServices.levelmenuitems.subscribe(levelmenuitems => this.levelmenuitems = levelmenuitems);
  }

  ngOnInit() {
  }

  megaMenuToggle() {
    this.navServices.levelMenu = false;
    this.navServices.megaMenu  = !this.navServices.megaMenu;
    if(window.innerWidth < 991) { 
      this.navServices.collapseSidebar = true;
    }
  }

  levelMenuToggle() {
    this.navServices.megaMenu  = false;
    this.navServices.levelMenu = !this.navServices.levelMenu;
    if(window.innerWidth < 991) { 
      this.navServices.collapseSidebar = true;
    }
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.megaItems.forEach(a => {
        if (this.megaItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) { return false; }
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  }


}
