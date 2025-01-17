import { useDispatch, useSelector } from "react-redux";
import { AppStoreStateType } from "../../../store/app.store";
import { useEffect } from "react";
import { setJobFilter } from "../../../features/reducers/job-filter/jobs-filter.slice";
import DropdownMenu from "../../../components/DropdownMenu";
import { JobsFilterType, OptionSelected } from "../../../features/reducers/job-filter/jobs-filter.interface";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Chip from "./chip.component";
import { CommonUtilities } from "../../../utils/common.utilities";
import { SLICE_NAMES } from "../../../features/slice-names.enum";
import { JobType } from "../../../features/reducers/jobs/jobs.interface";
import { Button } from "@mui/material";

export default function FilterComponent({ className, onSearchButtonClick, setAllJobs, onClearButtonClick }: { className?: string, onSearchButtonClick: () => void, setAllJobs: (v: string) => void, onClearButtonClick: () => void }) {

  const dispatch = useDispatch();
  const jobFilterValues = useSelector((state: AppStoreStateType) => state.root[SLICE_NAMES.JOBS_FILTER]);
  const jobs = useSelector((state: AppStoreStateType) => state.root[SLICE_NAMES.JOBS]);
  const selectedCity = useSelector((state: AppStoreStateType) => state.root[SLICE_NAMES.SELECTED_CITY]);
  let once = false;

  useEffect(() => {
    if (once) return;
    once = true;

    const jobFilterValues$ = { locations: Array.from(new Set(jobs.map((job: JobType) => job.location))), jobTypes: Array.from(new Set(jobs.map((job: JobType) => job.jobType))), companyNames: Array.from(new Set(jobs.map((job: JobType) => job.companyName))) };
    const jobFilterOptions = { locations: jobFilterValues$.locations.map((location: string) => ({ option: location, selected: false })), jobTypes: jobFilterValues$.jobTypes.map((jobType: string) => ({ option: jobType, selected: false })), companyNames: jobFilterValues$.companyNames.map((companyName: string) => ({ option: companyName, selected: false })) };
    dispatch(setJobFilter(jobFilterOptions));
    // setAllJobs('');

  }, []);

  useEffect(() => {
    const jobFilterValues$ = { locations: Array.from(new Set(jobs.map((job: JobType) => job.location))), jobTypes: Array.from(new Set(jobs.map((job: JobType) => job.jobType))), companyNames: Array.from(new Set(jobs.map((job: JobType) => job.companyName))) };
    const jobFilterOptions = { locations: jobFilterValues$.locations.map((location: string) => ({ option: location, selected: false })), jobTypes: jobFilterValues$.jobTypes.map((jobType: string) => ({ option: jobType, selected: false })), companyNames: jobFilterValues$.companyNames.map((companyName: string) => ({ option: companyName, selected: false })) };
    jobFilterOptions.locations = jobFilterOptions.locations.map((location: OptionSelected) => {
      if (location.option === selectedCity) {
        console.log('filter dash: ', selectedCity);
        return { option: selectedCity, selected: true };
      }
      return location;
    });
    dispatch(setJobFilter(jobFilterOptions));

  }, [selectedCity]);

  function onFilterOptionSelect(type: 'add' | 'remove', filterName: 'locations' | 'jobTypes' | 'companyNames', locationOption: string) {
    const updatedOptions = jobFilterValues[filterName].map(value => {
      if (value.option === locationOption) return { ...value, selected: type === 'add' ? (value.option === locationOption) : !(value.option === locationOption) }
      return { ...value };
    });
    const updatedJobFilter = { ...jobFilterValues, [filterName]: updatedOptions };
    dispatch(setJobFilter(updatedJobFilter));
  }

  function clearFilterHandler() {
    dispatch( setJobFilter(
      Object.entries(jobFilterValues)
        .map(([key, values]: [string, Array<OptionSelected>]) => ({ [key]: values.map((value: OptionSelected) => ({ ...value, selected: false })) }))
        .reduce((result, currentObj) => ({ ...result, ...Object.entries(currentObj).map(([key, value]: [string, Array<OptionSelected>]) => ({ [key]: value })).reduce(v => v) }), {}) as unknown as JobsFilterType
    ) );
    onClearButtonClick();
  }

  return (
    <div className={"flex flex-col gap-[2em] px-[4em] py-[2em] pb-[3em] rounded-[2em]  app-box-shadow " + (className || '')}>
      <div className="flex flex-col gap-[1em]">
        <div className="text-[1.5em] font-semibold">Location</div>
        <DropdownMenu onOptionClick={(option: string) => onFilterOptionSelect('add', 'locations', option)} options={jobFilterValues.locations.filter((value: OptionSelected) => !value.selected).map((value: OptionSelected) => value.option)} label='Select' endIcon={<KeyboardArrowDownIcon />} />
        <div className="flex flex-wrap gap-[0.5em]">
          {
            jobFilterValues.locations
              .filter((value: OptionSelected) => value.selected)
              .map((value: OptionSelected) =>
                <Chip onClick={() => onFilterOptionSelect('remove', 'locations', value.option)} label={value.option} className="text-[1.5em]" key={CommonUtilities.generateRandomString(15)} />
              )
          }
        </div>
      </div>
      <div className="flex flex-col gap-[1em]">
        <div className="text-[1.5em] font-semibold">Job Type</div>
        <DropdownMenu label='Select' onOptionClick={(option: string) => onFilterOptionSelect('add', 'jobTypes', option)} options={jobFilterValues.jobTypes.filter((value: OptionSelected) => !value.selected).map((value: OptionSelected) => value.option)} endIcon={<KeyboardArrowDownIcon />} />
        <div className="flex flex-wrap gap-[0.5em]">
          {
            jobFilterValues.jobTypes
              .filter((value: OptionSelected) => value.selected)
              .map((value: OptionSelected) =>
                <Chip onClick={() => onFilterOptionSelect('remove', 'jobTypes', value.option)} label={value.option} className="text-[1.5em]" key={CommonUtilities.generateRandomString(15)} />
              )
          }
        </div>
      </div>
      <div className="flex flex-col gap-[1em] mb-[0.5em]">
        <div className="text-[1.5em] font-semibold">Company</div>
        <DropdownMenu label='Select' onOptionClick={(option: string) => onFilterOptionSelect('add', 'companyNames', option)} options={jobFilterValues.companyNames.filter((value: OptionSelected) => !value.selected).map((value: OptionSelected) => value.option)} endIcon={<KeyboardArrowDownIcon />} />
        <div className="flex flex-wrap gap-[0.5em]">
          {
            jobFilterValues.companyNames
              .filter((value: OptionSelected) => value.selected)
              .map((value: OptionSelected) =>
                <Chip onClick={() => onFilterOptionSelect('remove', 'companyNames', value.option)} label={value.option} className="text-[1.5em]" key={CommonUtilities.generateRandomString(15)} />
              )
          }
        </div>
        <div className="flex gap-[1em] justify-between">
          <Button variant='contained' onClick={onSearchButtonClick}>Filter Results</Button>
          <Button variant='outlined' onClick={clearFilterHandler}>Clear</Button>
        </div>
      </div>

    </div>
  );
}