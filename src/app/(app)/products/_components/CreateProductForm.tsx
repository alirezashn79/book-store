'use client'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'
import { compact } from '@/libs/compact'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm, UseFormSetValue, useWatch } from 'react-hook-form'
import useCreateBook from '../_hooks/useCreateBook'
import { ICreateBookSchemaType } from '../_schemas'
import { revalidateBooksAction } from '../_actions/revalidateBooks'

const MediaSelector = dynamic(() => import('@/components/common/MediaSelector'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
  ),
})
const SelectCategory = dynamic(() => import('./SelectCategory'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
  ),
})
const SelectTopic = dynamic(() => import('./SelectTopic'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
  ),
})
const SelectPublisher = dynamic(() => import('./SelectPublisher'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
  ),
})
const SelectAuthor = dynamic(() => import('./SelectAuthor'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
  ),
})
const SelectTranslator = dynamic(() => import('./SelectTranslator'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
  ),
})

export default function CreateProductForm() {
  const [isShowOptionalFields, setIsShowOptionalFields] = useState(false)
  const { handleSubmit, control, setValue, reset } = useForm<ICreateBookSchemaType>({ mode: 'all' })
  const { imageIds, price, stock } = useWatch<ICreateBookSchemaType>({
    control,
  })

  const { mutateAsync, isPending, isSuccess } = useCreateBook()
  const onSubmit: SubmitHandler<ICreateBookSchemaType> = async (values) => {
    await mutateAsync(compact(values) as unknown as ICreateBookSchemaType, {
      onSuccess: async () => {
        await revalidateBooksAction()
        reset()
      },
    })
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
              rules={{
                required: { value: true, message: 'الزامی است' },
                minLength: { value: 4, message: 'حداقل 4 کلمه وارد کنید' },
              }}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error?.message}
                  success={!fieldState.invalid && fieldState.isDirty}
                />
              )}
            />
          </div>

          <div>
            <Label>قیمت</Label>
            <Controller
              control={control}
              name="price"
              rules={{
                required: { value: true, message: 'الزامی است' },
                min: { value: 10_000, message: 'قیمت از 10,000 تومان کمتر نباشد' },
              }}
              defaultValue={0}
              render={({ field: { onChange, ...rest }, fieldState }) => (
                <>
                  <Input
                    {...rest}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber
                      onChange(isNaN(val) ? 0 : val)
                    }}
                    dir="ltr"
                    type="number"
                    error={fieldState.error?.message}
                    success={!fieldState.invalid && fieldState.isDirty}
                  />
                  {!!price && price > 0 && (
                    <span className="mt-1 text-xs text-gray-500">
                      {price.toLocaleString()} تومان
                    </span>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <Label>موجودی انبار</Label>
            <Controller
              control={control}
              name="stock"
              rules={{
                validate: (v) => (v && v > 0) || 'الزامی است',
              }}
              defaultValue={0}
              render={({ field: { onChange, ...rest }, fieldState }) => (
                <>
                  <Input
                    {...rest}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber
                      onChange(isNaN(val) ? 0 : val)
                    }}
                    type="number"
                    dir="ltr"
                    error={fieldState.error?.message}
                    success={!fieldState.invalid && fieldState.isDirty}
                  />
                  {!!stock && stock > 0 && (
                    <span className="mt-1 text-xs text-gray-500">{stock.toLocaleString()} عدد</span>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <Label>عکس ها</Label>
            <Controller
              control={control}
              name="imageIds"
              rules={{
                required: { value: true, message: 'الزامی است' },
              }}
              defaultValue={[]}
              render={({ fieldState }) => (
                <MediaSelector
                  count={3}
                  values={imageIds ?? []}
                  field={'imageIds' as never}
                  setValue={setValue as UseFormSetValue<object>}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div>
            <Label>دسته بندی</Label>
            <Controller
              control={control}
              name="categoryIds"
              rules={{
                required: { value: true, message: 'حداقل یک مورد را انتخاب کنید' },
              }}
              defaultValue={[]}
              render={({ fieldState }) => (
                <SelectCategory
                  isSuccess={isSuccess}
                  formsetValue={setValue}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div>
            <Label>موضوعات</Label>
            <Controller
              control={control}
              name="topicIds"
              rules={{
                required: { value: true, message: 'حداقل یک مورد را انتخاب کنید' },
              }}
              defaultValue={[]}
              render={({ fieldState }) => (
                <SelectTopic
                  isSuccess={isSuccess}
                  formsetValue={setValue}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div>
            <Label>ناشر</Label>
            <Controller
              control={control}
              name="publisherId"
              rules={{
                validate: (v) => (v && v > 0) || 'حداقل یک مورد را انتخاب کنید',
              }}
              defaultValue={0}
              render={({ fieldState }) => (
                <SelectPublisher
                  isSuccess={isSuccess}
                  formsetValue={setValue}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div>
            <Label>نام نویسنده (ها)</Label>
            <Controller
              control={control}
              name="authorIds"
              rules={{
                required: { value: true, message: 'حداقل یک مورد را انتخاب کنید' },
              }}
              defaultValue={[]}
              render={({ fieldState }) => (
                <SelectAuthor
                  isSuccess={isSuccess}
                  formsetValue={setValue}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-center">
            <Controller
              control={control}
              name="isActive"
              defaultValue={true}
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

          {isShowOptionalFields && (
            <>
              <div>
                <Label optional>نام مترجم</Label>
                <Controller
                  control={control}
                  name="translatorIds"
                  rules={{
                    required: false,
                  }}
                  defaultValue={[]}
                  render={({ fieldState }) => (
                    <SelectTranslator
                      isSuccess={isSuccess}
                      formsetValue={setValue}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Label optional>شابک</Label>
                <Controller
                  control={control}
                  name="isbn"
                  rules={{
                    required: false,
                  }}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Input {...field} error={fieldState.error?.message} />
                  )}
                />
              </div>

              <div>
                <Label optional>تعداد صفحات</Label>
                <Controller
                  control={control}
                  name="pages"
                  rules={{
                    required: false,
                  }}
                  defaultValue={0}
                  render={({ field: { onChange, ...rest }, fieldState }) => (
                    <Input
                      type="number"
                      {...rest}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber
                        onChange(isNaN(val) ? 0 : val)
                      }}
                      dir="ltr"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Label optional>سال انتشار</Label>
                <Controller
                  control={control}
                  name="publishYear"
                  rules={{
                    required: false,
                  }}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Input {...field} type="date" error={fieldState.error?.message} />
                  )}
                />
              </div>

              <div>
                <Label optional>نوبت چاپ</Label>
                <Controller
                  control={control}
                  name="printEdition"
                  rules={{
                    required: false,
                  }}
                  defaultValue={0}
                  render={({ field: { onChange, ...rest }, fieldState }) => (
                    <Input
                      {...rest}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber
                        onChange(isNaN(val) ? 0 : val)
                      }}
                      dir="ltr"
                      type="number"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Label optional>زبان</Label>
                <Controller
                  control={control}
                  name="language"
                  rules={{
                    required: false,
                    minLength: { value: 4, message: 'حداقل 4 کلمه وارد کنید' },
                  }}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Input {...field} error={fieldState.error?.message} />
                  )}
                />
              </div>

              <div>
                <Label optional>جنس کاغذ</Label>
                <Controller
                  control={control}
                  name="paperType"
                  rules={{
                    required: false,
                    minLength: { value: 3, message: 'حداقل 3 کلمه وارد کنید' },
                  }}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Input {...field} error={fieldState.error?.message} />
                  )}
                />
              </div>

              <div>
                <Label optional>ابعاد</Label>
                <div className="flex items-center justify-center gap-2">
                  <Controller
                    control={control}
                    name="height"
                    rules={{
                      required: false,
                    }}
                    defaultValue={0}
                    render={({ field: { onChange, ...rest }, fieldState }) => (
                      <Input
                        {...rest}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber
                          onChange(isNaN(val) ? 0 : val)
                        }}
                        dir="ltr"
                        type="number"
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="width"
                    rules={{
                      required: false,
                    }}
                    defaultValue={0}
                    render={({ field: { onChange, ...rest }, fieldState }) => (
                      <Input
                        {...rest}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber
                          onChange(isNaN(val) ? 0 : val)
                        }}
                        dir="ltr"
                        type="number"
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <Label optional>وزن کتاب</Label>
                <Controller
                  control={control}
                  name="weight"
                  rules={{
                    required: false,
                  }}
                  defaultValue={0}
                  render={({ field: { onChange, ...rest }, fieldState }) => (
                    <Input
                      {...rest}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber
                        onChange(isNaN(val) ? 0 : val)
                      }}
                      type="number"
                      dir="ltr"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <Label optional>خلاصه</Label>
                <Controller
                  control={control}
                  name="description"
                  rules={{
                    required: false,
                    minLength: { value: 4, message: 'حداقل 4 کلمه وارد کنید' },
                  }}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <TextArea error={fieldState.error?.message} {...field} placeholder="" />
                  )}
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button disabled={isPending} type="submit" className="w-full sm:w-1/2 md:w-1/4">
            ثبت
          </Button>
        </div>
      </form>
    </ComponentCard>
  )
}
