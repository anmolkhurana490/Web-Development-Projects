import React from 'react'
import { useForm } from 'react-hook-form'

const SettingsComponent = ({ settingTitle, subSettings, register }) => {
    const selectOptions = {
        'region': ['Europe - DE', 'North America - US', 'Asia - JP', 'South America - BR', 'Australia - AU', 'Africa - ZA', 'Middle East - UAE'],
        'preset': ['Normal', 'Hardcore', 'Infantry Only', 'Custom', 'Realistic']
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 uppercase">{settingTitle}</h2>
            <ul className="text-18 text-white w-80 uppercase">
                {Object.entries(subSettings).map(([item, itemValue]) => {
                    if (item !== '_id') {
                        return (<li key={item}>
                            <span className="attribute">{item}</span>
                            <span className="value">
                                {(itemValue.type === "bool") ?
                                    (
                                        <input {...register(`${settingTitle}.${item}.value`)} type='checkbox' defaultChecked={itemValue.value} />
                                    ) : (itemValue.type === "number") ? (
                                        <input {...register(`${settingTitle}.${item}.value`)} type='Number' defaultValue={itemValue.value} className='bg-transparent w-12' />
                                    ) : (itemValue.type === "select") ? (
                                        <select {...register(`${settingTitle}.${item}.value`)} defaultValue={itemValue.value} className='bg-gray-900 w-32'>
                                            {selectOptions[item].map((element, index) => {
                                                return <option key={index}>{element}</option>
                                            })}
                                        </select>
                                    ) : ''
                                }
                            </span>
                        </li>)
                    }
                })}
            </ul>
        </div >
    )
}


const AllSettings = ({ settingsData, setSettingsData }) => {
    {/* Advanced Settings Section */ }
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();

    return (
        <form onSubmit={handleSubmit(setSettingsData)} className="si-all-settings flex gap-8 flex-wrap">
            {Object.entries(settingsData).map(([item, value]) => {
                if (item !== '_id')
                    return <SettingsComponent key={value._id} settingTitle={item} subSettings={value} register={register} />
            })}
            <input type="submit" value={isSubmitting ? "Saving..." : "Save Settings"} disabled={isSubmitting} className='font-bold text-xl border border-white rounded px-2 py-1 h-fit disabled:bg-gray-700' />
        </form>
    )
}

export default AllSettings
