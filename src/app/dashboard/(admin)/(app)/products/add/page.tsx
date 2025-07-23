'use client'
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import DropzoneComponent from '@/components/form/form-elements/DropZone'
import FileInput from '@/components/form/input/FileInput'
import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'
import { bookSchema, IBookAdd } from '@/features/products/schema'
import { joiResolver } from '@hookform/resolvers/joi'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function AddProductPage() {
  const [isShowOptionalFields, setIsShowOptionalFields] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IBookAdd>({
    resolver: joiResolver(bookSchema),
    defaultValues: {
      isActive: true,
    },
  })

  const onSubmit: SubmitHandler<IBookAdd> = (e) => {
    console.log(e)
  }

  console.log(errors)

  return (
    <div>
      <PageBreadcrumb pageTitle="محصولات" />

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
        <form>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>نام کتاب</Label>
              <Input {...register('title')} error={!!errors.title?.message} />
            </div>
            <div>
              <Label>نام نویسنده</Label>
              <Input {...register('author')} error={!!errors.author?.message} />
            </div>
            <div>
              <Label>قیمت</Label>
              <Input
                {...register('price', {
                  valueAsNumber: true,
                })}
                error={!!errors.price?.message}
              />
            </div>
            <div>
              <Label>موجودی</Label>
              <Input
                {...register('stock', {
                  valueAsNumber: true,
                })}
                error={!!errors.stock?.message}
              />
            </div>
            <div>
              <Label>تامنیل</Label>
              <FileInput {...register('thumbnail')} />
            </div>
            <div>
              <Label>دسته بندی</Label>
              <Input {...register('categoryId')} error={!!errors.categoryId?.message} />
            </div>
            {isShowOptionalFields && (
              <>
                <div>
                  <Label optional>نام مترجم</Label>
                  <Input {...register('translator')} error={!!errors.translator?.message} />
                </div>
                <div>
                  <Label optional>ناشر</Label>
                  <Input {...register('publisherId')} error={!!errors.publisherId?.message} />
                </div>
                <div>
                  <Label optional>سال انتشار</Label>
                  <Input {...register('publishYear')} error={!!errors.publishYear?.message} />
                </div>
                <div>
                  <Label optional>نوبت چاپ</Label>
                  <Input {...register('printEdition')} error={!!errors.printEdition?.message} />
                </div>
                <div>
                  <Label optional>شماره استاندارد بین المللی</Label>
                  <Input {...register('isbn')} error={!!errors.isbn?.message} />
                </div>

                <div>
                  <Label optional>زبان</Label>
                  <Input {...register('language')} error={!!errors.language?.message} />
                </div>
                <div>
                  <Label optional>تعداد صفحات</Label>
                  <Input
                    type="number"
                    {...register('pageCount', {
                      valueAsNumber: true,
                    })}
                    error={!!errors.pageCount?.message}
                  />
                </div>
                <div>
                  <Label optional>توع قظع</Label>
                  <Input {...register('format')} error={!!errors.format?.message} />
                </div>
                <div>
                  <Label optional>جنس کاغذ</Label>
                  <Input {...register('paperType')} error={!!errors.paperType?.message} />
                </div>
                <div>
                  <Label optional>نوع جلد</Label>
                  <Input {...register('coverType')} error={!!errors.coverType?.message} />
                </div>
                <div>
                  <Label optional>ابعاد</Label>
                  <Input {...register('dimensions')} error={!!errors.dimensions?.message} />
                </div>
                <div>
                  <Label optional>خلاصه</Label>
                  <TextArea
                    {...register('summary')}
                    error={!!errors.summary?.message}
                    placeholder=""
                  />
                </div>
              </>
            )}

            <div>
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
        </form>
        <div>
          <Label>عکس ها</Label>
          <DropzoneComponent />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSubmit(onSubmit)} className="w-full sm:w-1/2 md:w-1/4">
            ثبت
          </Button>
        </div>
      </ComponentCard>
    </div>
  )
}
