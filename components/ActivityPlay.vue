<template>
    <Card class="flex-2 mycard mt-6">
      <template #title><h1>Jouer une activité</h1></template>
      <template #content>
        <p class="m-0">
        <div class="relative mt-2 rounded-md shadow-sm">
        <label for="code">Saisir le code</label>
          <input type="text" name="code" id="code"
            class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="a12b-345678">
        </div>
        </p>
      </template>
    </Card>
</template>

