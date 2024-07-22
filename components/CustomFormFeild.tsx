"use client";

import React from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control,  } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";
import { E164Number } from "libphonenumber-js";


interface CustomFormFeildProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelects?:boolean,
    children?: React.ReactNode,
    renderSkeleton?: (feild:any) => React.ReactNode,

}

const RenderField=({field, props}:{field: any, props: CustomFormFeildProps})=>{
    const {placeholder, iconAlt, iconSrc, fieldType} = props
    switch (fieldType) {
        case FormFieldType.INPUT:
            return(
                <div className="flex rounded-md border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image src={iconSrc}  height={24} width={24} alt={iconAlt || 'icon'} className="ml-2"/>
                    )}
                    <FormControl>
                        <Input placeholder={placeholder} {...field} className="shad-input border-0"/>
                    </FormControl>
                </div>
            )
        case FormFieldType.PHONE_INPUT:
            return(
                    <FormControl>
                    <PhoneInput
                    defaultCountry="IN"
                    placeholder={placeholder}
                    international
                    withCountryCallingCode
                    value={field.value as E164Number | undefined}
                    onChange={field.onChange}
                    className="input-phone"
                    />
                    </FormControl>
            )
        default:
            break;
    }
}

const CustomFormFeild = (props : CustomFormFeildProps) => {
    const {control, fieldType, name, label} = props
  return (
    <div>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex-1">
            {fieldType !== FormFieldType.CHECKBOX && label &&(
                <FormLabel>{label}</FormLabel>
                )
             }
             <RenderField field={field} props={props} />
            <FormMessage className="shad-error"></FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CustomFormFeild;
