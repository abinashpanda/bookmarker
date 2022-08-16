import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { HiPlus } from 'react-icons/hi'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from 'react-query'
import Button from 'ui/button'
import Field from 'ui/field'
import Input from 'ui/input'
import Modal from 'ui/modal'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Bookmark } from 'types/bookmark.types'
import { fetchBookmarkData } from './queries'

const validationSchema = Yup.object().shape({
  url: Yup.string().url('Invalid URL').required('URL is required'),
})

type CreateBookmarkButtonProps = {
  className?: string
  style?: React.CSSProperties
}

export default function CreateBookmarkButton({ className, style }: CreateBookmarkButtonProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: fetchBookmarkDataMutation, isLoading } = useMutation(fetchBookmarkData, {
    onError: (error: AxiosError<{ message: string }>) => {
      const errorMessage = error.response?.data?.message ?? 'Something went wrong'
      toast.error(errorMessage)
    },
    onSuccess: (bookmarkFetched) => {
      queryClient.setQueryData<Bookmark[]>(['bookmarks'], (prevData) => {
        if (prevData) {
          return [...prevData, { id: `bookmark-${prevData.length}`, ...bookmarkFetched }]
        }
        return []
      })
      setModalVisible(false)
    },
  })

  const formik = useFormik({
    validationSchema,
    initialValues: { url: '' },
    onSubmit: ({ url }) => {
      fetchBookmarkDataMutation(url)
    },
  })

  useEffect(
    function getCopiedTextFromClipboard() {
      navigator.clipboard.readText().then((text) => {
        Yup.string()
          .url()
          .validate(text)
          .then(() => {
            formik.setValues({ url: text })
          })
          .catch(() => {})
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we don't want to run this effect on every change
    [modalVisible],
  )

  return (
    <>
      <Button
        icon={<HiPlus />}
        className={className}
        style={style}
        onClick={() => {
          setModalVisible(true)
        }}
      >
        Bookmark
      </Button>
      <Modal
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
        title="Add Bookmark"
        onOk={formik.handleSubmit}
        okButtonProps={{
          type: 'submit',
          loading: isLoading,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Field label="Site URL" name="url" errorMessage={formik.errors.url}>
            <Input className="w-full" onChange={formik.handleChange('url')} value={formik.values.url} />
          </Field>
        </form>
      </Modal>
    </>
  )
}
