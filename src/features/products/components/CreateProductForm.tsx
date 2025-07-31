'use client'
import ComponentCard from '@/components/common/ComponentCard'
import CreatableMultiSelectComponent from '@/components/form/CreatableMultiSelect'
import CreatableSelectComponent from '@/components/form/CreatableSelect'
import FileInput from '@/components/form/input/FileInput'
import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import { OptionType } from '@/components/form/Select'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'
import { bookSchema, IBookAdd } from '@/features/products/schema'
import { createUppy } from '@/libs/createUppy'
import { joiResolver } from '@hookform/resolvers/joi'
import Dashboard from '@uppy/react/lib/Dashboard'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { categoryOptions, topicOptions } from '../data'
import { useTheme } from '@/context/ThemeContext'
import useGetCategories from '@/features/categories/hooks/useGetCategories'

const fetchCategories = (): Promise<OptionType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categoryOptions) // برگرداندن گزینه‌ها
    }, 1000) // شبیه‌سازی تاخیر سرور
  })
}

// تابع برای ایجاد گزینه جدید
const createCategory = async (label: string): Promise<OptionType> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeId = crypto.randomUUID() // شبیه‌سازی آیدی برگشتی از بک‌اند
      resolve({ value: fakeId, label })
    }, 1000)
  })
}

const fetchTopics = (): Promise<OptionType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(topicOptions) // برگرداندن گزینه‌ها
    }, 1000) // شبیه‌سازی تاخیر سرور
  })
}

// تابع برای ایجاد گزینه جدید
const createTopic = async (label: string): Promise<OptionType> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeId = crypto.randomUUID() // شبیه‌سازی آیدی برگشتی از بک‌اند
      resolve({ value: fakeId, label })
    }, 1000)
  })
}

export default function CreateProductForm() {
  const [isShowOptionalFields, setIsShowOptionalFields] = useState(false)
  const [uppy] = useState(createUppy)
  const { theme } = useTheme()
  const { data: categories } = useGetCategories({ responseType: true })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IBookAdd>({
    resolver: joiResolver(bookSchema),
    defaultValues: {
      isActive: true,
      topics: [],
    },
  })

  console.log(errors)
  const onSubmit: SubmitHandler<IBookAdd> = (e) => {
    console.log(e)
  }

  return (
    <ComponentCard
      title="محصول جدید"
      button={
        <Switch
          label="نمایش فیلدهای تکمیلی"
          defaultChecked={isShowOptionalFields}
          onChange={(e) => setIsShowOptionalFields(e)}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label>نام کتاب</Label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => <Input {...field} error={errors.title?.message} />}
            />
          </div>

          <div>
            <Label>نام نویسنده</Label>
            <Controller
              control={control}
              name="author"
              render={({ field }) => <Input {...field} error={errors.author?.message} />}
            />
          </div>
          <div>
            <Label>قیمت</Label>

            <Controller
              control={control}
              name="price"
              render={({ field }) => <Input {...field} error={errors.price?.message} />}
            />
          </div>
          <div>
            <Label>موجودی</Label>
            <Controller
              control={control}
              name="stock"
              render={({ field }) => <Input {...field} error={errors.price?.message} />}
            />
          </div>
          <div>
            <Label optional>تامنیل</Label>
            <FileInput {...register('thumbnail')} />
          </div>
          <div>
            <Label>دسته بندی</Label>
            {/* <Input {...register('categoryId')} error={errors.categoryId?.message} /> */}
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <CreatableSelectComponent
                  fetchOptions={fetchCategories}
                  createOption={createCategory}
                  value={field.value ? { value: field.value, label: field.value } : null}
                  onChange={(val) => field.onChange(val?.value)}
                  placeholder="دسته‌بندی را انتخاب یا ایجاد کنید"
                />
              )}
            />
          </div>
          <div>
            <Label>موضوعات</Label>
            <Controller
              name="topics"
              control={control}
              render={({ field }) => (
                <CreatableMultiSelectComponent
                  fetchOptions={fetchTopics}
                  createOption={createTopic}
                  placeholder="موضوعات را انتخاب یا ایجاد کنید"
                  value={
                    (field.value || []).map((v) => ({ label: v, value: v })) // نمایش اولیه
                  }
                  onChange={(newVals) => field.onChange(newVals.map((v) => v.value))} // فقط array of value
                />
              )}
            />
          </div>
          {isShowOptionalFields && (
            <>
              <div>
                <Label optional>نام مترجم</Label>
                <Input {...register('translator')} error={errors.translator?.message} />
              </div>
              <div>
                <Label optional>ناشر</Label>
                <Input {...register('publisherId')} error={errors.publisherId?.message} />
              </div>
              <div>
                <Label optional>سال انتشار</Label>
                <Input {...register('publishYear')} error={errors.publishYear?.message} />
              </div>
              <div>
                <Label optional>نوبت چاپ</Label>
                <Input {...register('printEdition')} error={errors.printEdition?.message} />
              </div>
              <div>
                <Label optional>شماره استاندارد بین المللی</Label>
                <Input {...register('isbn')} error={errors.isbn?.message} />
              </div>

              <div>
                <Label optional>زبان</Label>
                <Input {...register('language')} error={errors.language?.message} />
              </div>
              <div>
                <Label optional>تعداد صفحات</Label>
                <Input
                  type="number"
                  {...register('pageCount', {
                    valueAsNumber: true,
                  })}
                  error={errors.pageCount?.message}
                />
              </div>
              <div>
                <Label optional>توع قظع</Label>
                <Input {...register('format')} error={errors.format?.message} />
              </div>
              <div>
                <Label optional>جنس کاغذ</Label>
                <Input {...register('paperType')} error={errors.paperType?.message} />
              </div>
              <div>
                <Label optional>نوع جلد</Label>
                <Input {...register('coverType')} error={errors.coverType?.message} />
              </div>
              <div>
                <Label optional>ابعاد</Label>
                <Input {...register('dimensions')} error={errors.dimensions?.message} />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label optional>خلاصه</Label>
                <TextArea {...register('summary')} error={errors.summary?.message} placeholder="" />
              </div>
            </>
          )}

          <div className="py-4 sm:col-span-2 lg:col-span-3">
            <Controller
              control={control}
              name="isActive"
              render={({ field: { value, onChange, ...rest } }) => (
                <Switch
                  label={`وضعیت (${value ? 'فعال' : 'غیرفعال'})`}
                  defaultChecked={value}
                  onChange={onChange}
                  {...rest}
                />
              )}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" className="w-full sm:w-1/2 md:w-1/4">
            ثبت
          </Button>
        </div>
      </form>
      <div>
        <Label optional>عکس ها</Label>
        {/* <DropzoneComponent /> */}
        <Dashboard className="!w-full" theme={theme} uppy={uppy} />
      </div>
    </ComponentCard>
  )
}
