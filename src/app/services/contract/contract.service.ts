import { Injectable } from '@angular/core';
import { ALTERNATIVE_SHIFT_DISPLAY_NAME, ALTERNATIVE_SHIFT_ID, COMPLETE_WEEKEND_DISPLAY_NAME, COMPLETE_WEEKEND_ID, FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME, FREE_DAYS_AFTER_SHIFT_ID, IDENTICAL_WEEKEND_DISPLAY_NAME, IDENTICAL_WEEKEND_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_DISPLAY_NAME, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_ID, MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_DISPLAY_NAME, MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_ID, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME, TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID, UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_ID, UNWANTED_SKILLS_DISPLAY_NAME, UNWANTED_SKILLS_ID } from 'src/app/constants/constraints';
import { AlternativeShift, AlternativeShiftInterface } from 'src/app/models/AlternativeShift';
import { BooleanConstraint } from 'src/app/models/BooleanConstraint';
import { Constraint, ConstraintInterface } from 'src/app/models/Constraint';
import { Contract, ContractInterface } from 'src/app/models/Contract';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';
import { MinMaxConstraint, MinMaxConstraintInterface } from 'src/app/models/MinMaxConstraint';
import { MinMaxShiftConstraint, MinMaxShiftConstraintInterface } from 'src/app/models/MinMaxShiftConstraint';
import { ShiftConstraint, ShiftConstraintInterface } from 'src/app/models/ShiftConstraint';
import { UnwantedPatterns, UnwantedPatternsInterface} from 'src/app/models/UnwantedPatterns';
import { UnwantedSkills } from 'src/app/models/UnwantedSkills';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ADD_CONTRACT_URL, DELETE_CONTRACT, FETCH_CONTRACT_BY_NAME, FETCH_CONTRACT_NAMES, FETCH_CONTRACT_URL, UPDATE_CONTRACT_URL } from 'src/app/constants/api-constants';
import { Exception } from 'src/app/utils/Exception';
import { ALTERNATIVE_SHIFT_DESCRIPTION, FREE_DAYS_AFTER_SHIFT_DESCRIPTION, IDENTICAL_WEEKEND_DESCRIPTION, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DESCRIPTION, UNWANTED_PATTERNS_DESCRIPTION } from 'src/app/constants/constraintsDescriptions';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  contract: Contract;

  constructor(private httpClient: HttpClient) {
    this.contract = new Contract();
  }

  setContract(c: Contract) {
    this.contract = c;
  }

  validateContract(): void {
    // validate contract
    for(let i=0; i< this.contract.constraints.length; i++){
      for(let j=i+1; j< this.contract.constraints.length; j++){
        (this.contract.constraints[j] as Constraint).validateConstraint((this.contract.constraints[i] as Constraint));
      }
    }
  }

  getJson(): ContractInterface{
    return this.contract.toJson(CacheUtils.getProfile());
  }

  fromJson(contractJson: ContractInterface): Contract {
    const contract: Contract = new Contract();
    contract.name = contractJson.name;
    for(const c of (contractJson.constraints as ConstraintInterface[])){
      let constraint;
      switch(c.name) {
        case UNWANTED_PATTERNS_ID:
          constraint = new UnwantedPatterns(c.name, UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_DESCRIPTION);
          constraint.fromJson(c as UnwantedPatternsInterface);
          break;

        case ALTERNATIVE_SHIFT_ID:
          constraint = new AlternativeShift(c.name, ALTERNATIVE_SHIFT_DISPLAY_NAME, ALTERNATIVE_SHIFT_DESCRIPTION);
          constraint.fromJson(c as AlternativeShiftInterface);
          break;

        case FREE_DAYS_AFTER_SHIFT_ID:
          constraint = new ShiftConstraint(c.name, FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME, FREE_DAYS_AFTER_SHIFT_DESCRIPTION);
          constraint.fromJson(c as ShiftConstraintInterface);
          break;
        
        case MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID:
          constraint = new MinMaxShiftConstraint(c.name, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DESCRIPTION);
          constraint.fromJson(c as MinMaxShiftConstraintInterface);
          break;
        
        case IDENTICAL_WEEKEND_ID:
          constraint = new BooleanConstraint(c.name, IDENTICAL_WEEKEND_DISPLAY_NAME, IDENTICAL_WEEKEND_DESCRIPTION);
          constraint.fromJson(c as BooleanConstraint);
          break;

        case COMPLETE_WEEKEND_ID:
          constraint = new BooleanConstraint(c.name, COMPLETE_WEEKEND_DISPLAY_NAME);
          constraint.fromJson(c as BooleanConstraint);
          break;
        
        case TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID:
          constraint = new MinMaxConstraint(c.name, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME);
          constraint.fromJson(c as MinMaxConstraintInterface);
          break;
        
        case MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID:
          constraint = new MinMaxConstraint(c.name, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME);
          constraint.fromJson(c as MinMaxConstraintInterface);
          break;

        case MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_ID:
          constraint = new MinMaxConstraint(c.name, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_DISPLAY_NAME);
          constraint.fromJson(c as MinMaxConstraintInterface);
          break;
        
        case UNWANTED_SKILLS_ID:
          constraint = new UnwantedSkills(c.name, UNWANTED_SKILLS_DISPLAY_NAME);
          constraint.fromJson(c as UnwantedSkills);
          break;

        case MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_ID:
          constraint = new MinMaxConstraint(c.name, MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_DISPLAY_NAME);
          constraint.fromJson(c as MinMaxConstraintInterface);
          break;

        default: break;
      }
      contract.constraints.push(constraint);
    }
    return contract;
  }

  addContract(contract: ContractInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_CONTRACT_URL, contract, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }


  getContractNames():Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<string[]>(FETCH_CONTRACT_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  
  getContracts():Observable<ContractInterface[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<ContractInterface[]>(FETCH_CONTRACT_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  

  getContractByName(name:string):Observable<ContractInterface> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append("name", name);
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      return this.httpClient.get<ContractInterface>(FETCH_CONTRACT_BY_NAME, {
        params: queryParams,
      })
    }catch(err){
      throw new Exception("user not logged in");
    }    
  }

  updateContract(contract: ContractInterface):Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.put<HttpResponse<string>>(UPDATE_CONTRACT_URL, contract, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  deleteContract(contract:string):Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", contract);
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      return this.httpClient.delete<HttpResponse<string>>(DELETE_CONTRACT,{
        params: queryParams,
      });
    } catch(err){
      throw new Exception("user not logged in");
    }
  }
}
