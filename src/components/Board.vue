<script setup>
import { useGameStore } from '../stores/gameStore'
const store = useGameStore()

defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})
</script>

<template>
  <div class="grid grid-rows-5 gap-1.5 sm:gap-2">
    <div v-for="(row, rowIndex) in store.board" :key="rowIndex" 
         class="grid gap-1.5 sm:gap-2"
         :class="{
           'grid-cols-4': store.wordLength === 4,
           'grid-cols-5': store.wordLength === 5,
           'grid-cols-6': store.wordLength === 6
         }">
      
      <div 
        v-for="(col, colIndex) in row" 
        :key="colIndex"
        class="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl sm:text-3xl uppercase transition-colors duration-300"
        :class="{
          'font-bold': theme !== 'raw', // Theme lain semua bold
          'font-normal': theme === 'raw', // RAW guna font biasa
          
          'border-2': theme !== 'xp' && theme !== 'raw', 
          'border': theme === 'raw', // RAW guna border 1px je
          
          // THEME: DARK
          'bg-gray-800 border-gray-600 text-white': theme === 'dark' && !store.colors[rowIndex][colIndex], 
          'bg-[#538d4e] border-[#538d4e] text-white': theme === 'dark' && store.colors[rowIndex][colIndex] === 'correct', 
          'bg-[#b59f3b] border-[#b59f3b] text-white': theme === 'dark' && store.colors[rowIndex][colIndex] === 'present',
          'bg-[#3a3a3c] border-[#3a3a3c] text-white': theme === 'dark' && store.colors[rowIndex][colIndex] === 'absent',

          // THEME: LIGHT
          'bg-white border-gray-300 text-gray-900': theme === 'light' && !store.colors[rowIndex][colIndex], 
          'bg-[#6aaa64] border-[#6aaa64] text-white': theme === 'light' && store.colors[rowIndex][colIndex] === 'correct', 
          'bg-[#c9b458] border-[#c9b458] text-white': theme === 'light' && store.colors[rowIndex][colIndex] === 'present',
          'bg-[#787c7e] border-[#787c7e] text-white': theme === 'light' && store.colors[rowIndex][colIndex] === 'absent',

          // THEME: VILLAGE 
          'bg-[#78350f] border-[#451a03] text-[#fef3c7] shadow-sm': theme === 'village' && !store.colors[rowIndex][colIndex], 
          'bg-[#166534] border-[#14532d] text-white shadow-sm': theme === 'village' && store.colors[rowIndex][colIndex] === 'correct', 
          'bg-[#ca8a04] border-[#a16207] text-white shadow-sm': theme === 'village' && store.colors[rowIndex][colIndex] === 'present', 
          'bg-[#57534e] border-[#44403c] text-[#d6d3d1] shadow-sm': theme === 'village' && store.colors[rowIndex][colIndex] === 'absent',

          // THEME: WINDOWS XP 
          'bg-white border-[3px] border-t-gray-600 border-l-gray-600 border-b-white border-r-white text-black': theme === 'xp' && !store.colors[rowIndex][colIndex], 
          'bg-[#00ea00] border-[3px] border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-black shadow-md': theme === 'xp' && store.colors[rowIndex][colIndex] === 'correct', 
          'bg-[#ffff00] border-[3px] border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-black shadow-md': theme === 'xp' && store.colors[rowIndex][colIndex] === 'present', 
          'bg-[#c0c0c0] border-[3px] border-t-white border-l-white border-b-gray-600 border-r-gray-600 text-gray-700 shadow-md': theme === 'xp' && store.colors[rowIndex][colIndex] === 'absent',

          // THEME: RAW HTML (Basic CSS Colors)
          'bg-white border-black text-black': theme === 'raw' && !store.colors[rowIndex][colIndex], 
          'bg-green-500 border-black text-black': theme === 'raw' && store.colors[rowIndex][colIndex] === 'correct', 
          'bg-yellow-400 border-black text-black': theme === 'raw' && store.colors[rowIndex][colIndex] === 'present', 
          'bg-gray-300 border-black text-black': theme === 'raw' && store.colors[rowIndex][colIndex] === 'absent'
        }"
      >
        {{ col }}
      </div>
      
    </div>
  </div>
</template>