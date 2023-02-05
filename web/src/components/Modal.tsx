import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, ReactNode } from 'react'
import { FiSend } from 'react-icons/fi'

type Props = {
    title: string,
    isOpen: boolean,
    onClose: (value: boolean) => void,
    onSubmit: (value: any) => void,
    children: ReactNode
}
const Modal: FC<Props> = ({ title, isOpen, onClose, onSubmit, children }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-5 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {title}
                                </Dialog.Title>
                                <div className="mt-2 flex flex-col gap-2">
                                    {children}
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        className='f-btn f-primary'
                                        onClick={(e) => onSubmit(e)}
                                    >
                                        <FiSend /> Submit
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal