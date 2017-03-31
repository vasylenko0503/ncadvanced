import {Component, OnInit, ViewChild} from "@angular/core";
import {ToastsManager} from "ng2-toastr";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {AuthService, AuthEvent} from "../../service/auth.service";
import {CustomValidators} from "ng2-validation";
import {BarChartComponent} from "../../shared/bar-chart/bar-chart.component";
import {LineChartComponent} from "../../shared/line-chart/line-chart.component";
import {ReportService} from "../../service/report.service";
import {User} from "../../model/user.model";
import {Subject} from "rxjs";
import * as FileSaver from "file-saver";

@Component({
  selector: 'report',
  templateUrl: 'report.component.html',
  styleUrls: ['report.component.css']
})

export class ReportComponent implements OnInit {

  private role: string;
  private currentUser: User;
  private reportForm: FormGroup;

  @ViewChild(BarChartComponent)
  public barChart: BarChartComponent;

  @ViewChild(LineChartComponent)
  public lineChart: LineChartComponent;
  private startDate: any;
  private endDate: any;
  private isGenerated: boolean = false;
  private countManagers: number[] = [1, 3, 5, 10];
  private countTopManagers: number;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private reportService: ReportService,
              private authService: AuthService,
              private toastr: ToastsManager) {
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });
    this.role = this.authService.role;
    this.authService.events.subscribe((event: Subject<AuthEvent>) => {
      if (event.constructor.name === 'DidLogin') {
        this.role = this.authService.role;
      }
    });
    this.initForm();
  }

  validateField(field: string): boolean {
    return this.reportForm.get(field).valid || !this.reportForm.get(field).dirty;
  }

  private initForm(): void {
    this.reportForm = this.formBuilder.group({
      dateOfStart: ['', CustomValidators.dateISO],
      dateOfEnd: ['', CustomValidators.dateISO],
      countManagersSelector: [''],
    });
  }

  private saveDates(formData) {
    if (formData.dateOfEnd > formData.dateOfStart) {
      this.countTopManagers = formData.countManagersSelector;
      this.startDate = formData.dateOfStart;
      this.endDate = formData.dateOfEnd;
      console.log(this.countTopManagers);
      if (!this.isGenerated) {
        this.isGenerated = true;
      } else {
        this.generateReportByRole(this.startDate, this.endDate);
      }
      this.toastr.success("START Date: ".concat(this.startDate.toString() + ", END Date:" + this.endDate.toString()), "DATA:");
    }
    else {
      this.toastr.error("Error. Incorrect dates: End date must be bigger than the start date");
    }
  }

  private generateReportByRole(start: any, end: any) {
    if (this.isAdmin()) {
      this.barChart.buildAdminChart(start, end, this.countTopManagers);
      this.lineChart.buildAdminChart(start, end);
    } else {
      this.barChart.buildManagerChart(start, end);
    }
  }

  private generateAdminPDF() {
    this.reportService.getAdminPDFReport(this.startDate, this.endDate, this.countTopManagers).subscribe(
      (res: any) => {
        let blob = res.blob();
        let filename = 'admin_report_from_' + this.startDate + '_to_' + this.endDate + '.pdf';
        FileSaver.saveAs(blob, filename);
      }
    );
  }

  private generateManagerPDF() {
    this.reportService.getManagerPDFReport(this.startDate, this.endDate, this.currentUser.id).subscribe(
      (res: any) => {
        let blob = res.blob();
        let filename = 'manager_report_from_' + this.startDate + '_to_' + this.endDate + '.pdf';
        FileSaver.saveAs(blob, filename);
      }
    );
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isManager(): boolean {
    return this.role === 'office manager'
  }

}