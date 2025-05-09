import React from 'react'

export const Form = ({ handleSubmit, handleChange, input }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-2 mt-4 min-w-[200px] mx-auto max-w-120 bg-neutral-800 rounded-lg p-4'
    >
      <h3 className='text-center text-lg font-bold'>Agregar Acción</h3>
      <label htmlFor='name' className='text-neutral-400'>
        Nombre
      </label>
      <input
        name='name'
        type='text'
        value={input.name}
        onInput={handleChange}
        required
        className='bg-neutral-900 rounded-lg p-1 px-6 w-full outline-none focus:ring-2 focus:ring-red-400'
      />
      <label htmlFor='description' className='text-neutral-400'>
        Descripción
      </label>
      <input
        type='text'
        name='description'
        value={input.description}
        onInput={handleChange}
        className='bg-neutral-900 rounded-lg p-1 px-6 max-w-[600px]  w-full  outline-none focus:ring-2 focus:ring-red-400'
      />
      <div className='flex flex-row flex-wrap gap-2 justify-around'>
        <label htmlFor='days' className='text-neutral-400'>
          Días : <span> </span>
          <input
            name='days'
            type='number'
            value={input.days}
            onInput={handleChange}
            min={0}
            className='text-center bg-neutral-900 rounded-lg p-1 w-[4rem] outline-none focus:ring-2 focus:ring-red-400'
          />
        </label>

        <label htmlFor='hours' className='text-neutral-400'>
          Horas : <span> </span>
          <input
            name='hours'
            type='number'
            value={input.hours}
            onInput={handleChange}
            min={0}
            max={24}
            className='text-center bg-neutral-900 rounded-lg p-1 w-[4rem] outline-none focus:ring-2 focus:ring-red-400'
          />
        </label>

        <label htmlFor='minutes' className='text-neutral-400'>
          Minutos : <span> </span>
          <input
            name='minutes'
            type='number'
            value={input.minutes}
            onInput={handleChange}
            max={60}
            min={0}
            className='text-center bg-neutral-900 rounded-lg p-1 w-[4rem] outline-none focus:ring-2 focus:ring-red-400'
          />
        </label>
      </div>
      <button
        type='submit'
        className='bg-red-700 rounded-lg py-2 text-white hover:bg-red-800'
      >
        Agregar
      </button>
    </form>
  )
}
