import { Component,Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SkillService } from 'src/app/services/shift/skill.service';


@Component({
  selector: 'app-hopspital-demand-creation',
  templateUrl: './hopspital-demand-creation.component.html',
  styleUrls: ['./hopspital-demand-creation.component.css']
})
export class HopspitalDemandCreationComponent{

  @Input() shifts!: string[];
  @Input() skills!: string[]; 
  @Input() index!: number;
  step = 0;
  panelOpenState = false;


  constructor(private skillService: SkillService,  private dialog: MatDialog){
  }
  
setStep(index: number) {
  this.step = index;
}

nextStep() {
  this.step++;
}

prevStep() {
  this.step--;
}

}
