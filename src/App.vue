<script setup>
import { ref, onMounted, onUnmounted } from 'vue' 
import Board from './components/Board.vue'
import { useGameStore } from './stores/gameStore'

const store = useGameStore()

// Variabel untuk simpan theme semasa (default: dark)
const currentTheme = ref('dark')

// FUNGSI BARU: Untuk buka link rujukan
const handleReferenceChange = (event) => {
  const url = event.target.value;
  if (url) {
    window.open(url, '_blank'); // Buka link dalam tab baru
    event.target.value = ""; // Reset balik dropdown ke "Reference" lepas dah klik
  }
}

onMounted(() => {
  store.initGame()
  window.addEventListener('keydown', handleKeydown)
})

const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); 
    store.submitWord();
  } else if (e.key === 'Backspace') {
    store.removeLetter();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    store.addLetter(e.key);
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div 
    class="min-h-screen flex flex-col items-center w-full overflow-hidden relative transition-colors duration-500"
    :class="{
      'bg-gray-900 text-white font-sans': currentTheme === 'dark',
      'bg-gray-50 text-gray-900 font-sans': currentTheme === 'light',
      'bg-amber-900 text-amber-50 font-sans': currentTheme === 'village',
      'bg-[#0054e3] text-white font-sans': currentTheme === 'xp',
      'bg-white text-black font-serif': currentTheme === 'raw' // RAW: Putih dan Times New Roman
    }"
  >
    
    <!-- Toast Notification -->
    <div 
      v-if="store.errorMessage" 
      class="fixed top-24 px-6 py-3 shadow-2xl font-bold z-50 animate-[fadeInDown_0.2s_ease-out]"
      :class="{
        'bg-gray-100 text-gray-900 rounded-lg': currentTheme === 'dark' || currentTheme === 'light',
        'bg-amber-100 text-amber-900 rounded-lg': currentTheme === 'village',
        'bg-[#ffffe1] text-black border border-black text-sm rounded-none': currentTheme === 'xp',
        'bg-white text-black border border-black rounded-none': currentTheme === 'raw'
      }"
    >
      {{ store.errorMessage }}
    </div>

    <!-- HEADER -->
    <header 
      class="w-full flex flex-row flex-wrap items-center justify-center py-4 px-4 shadow-md z-10 gap-4 sm:gap-8 transition-colors duration-500"
      :class="{
        'bg-gray-800 border-b border-gray-700': currentTheme === 'dark',
        'bg-white border-b border-gray-200': currentTheme === 'light',
        'bg-amber-800 border-b border-amber-950': currentTheme === 'village',
        'bg-gradient-to-r from-[#0058e6] to-[#3a93ff] border-b-[3px] border-b-white': currentTheme === 'xp',
        'bg-white border-b border-black shadow-none': currentTheme === 'raw' // RAW: Tiada bayang, garisan hitam
      }"
    >
      <h1 class="text-2xl sm:text-3xl uppercase m-0"
          :class="{ 
            'font-extrabold tracking-widest': currentTheme !== 'xp' && currentTheme !== 'raw', 
            'font-extrabold tracking-normal drop-shadow-md': currentTheme === 'xp',
            'font-bold tracking-normal': currentTheme === 'raw' // RAW: Teks biasa
          }">
        WORDLE BM
      </h1>

      <div class="flex flex-row items-center gap-2 sm:gap-4">
        <!-- Dropdown Reference -->
        <select 
          @change="handleReferenceChange"
          class="text-xs sm:text-sm py-2 px-2 sm:px-3 focus:outline-none cursor-pointer transition-colors"
          :class="{
            'font-semibold bg-gray-700 text-white border border-gray-600 rounded-md': currentTheme === 'dark',
            'font-semibold bg-gray-100 text-gray-900 border border-gray-300 rounded-md': currentTheme === 'light',
            'font-semibold bg-amber-700 text-amber-50 border border-amber-900 rounded-md': currentTheme === 'village',
            'font-semibold bg-white text-black border-2 border-gray-400 rounded-none shadow-inner': currentTheme === 'xp',
            'font-normal bg-white text-black border border-black rounded-none': currentTheme === 'raw'
          }"
        >
          <option value="" disabled selected>Reference</option>
          <option value="https://prpm.dbp.gov.my/">Kamus Dewan</option>
          <option value="https://ms.wiktionary.org/wiki/Wikikamus:Senarai_perkataan_mengikut_susunan_abjad">Wiki Kamus</option>
        </select>

        <!-- Dropdown Theme -->
        <select 
          v-model="currentTheme" 
          class="text-xs sm:text-sm py-2 px-2 sm:px-3 focus:outline-none cursor-pointer transition-colors"
          :class="{
            'font-semibold bg-gray-700 text-white border border-gray-600 rounded-md': currentTheme === 'dark',
            'font-semibold bg-gray-100 text-gray-900 border border-gray-300 rounded-md': currentTheme === 'light',
            'font-semibold bg-amber-700 text-amber-50 border border-amber-900 rounded-md': currentTheme === 'village',
            'font-semibold bg-white text-black border-2 border-gray-400 rounded-none shadow-inner': currentTheme === 'xp',
            'font-normal bg-white text-black border border-black rounded-none': currentTheme === 'raw'
          }"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="village">Village</option>
          <option value="xp">Windows XP</option>
          <option value="raw">Html</option>
        </select>
      </div>
    </header>

    <div class="flex-grow flex flex-col items-center justify-center w-full max-w-4xl px-4 py-8">
      
      <!-- Butang Pilihan Mod Game -->
      <div class="flex space-x-2 mb-8">
        <button 
          @click="store.initGame(4)"
          class="px-4 py-2 text-sm sm:text-base transition-colors"
          :class="{
            'font-bold rounded bg-blue-600 text-white': store.wordLength === 4 && currentTheme !== 'village' && currentTheme !== 'xp' && currentTheme !== 'raw',
            'font-bold rounded bg-green-700 text-white shadow-inner': store.wordLength === 4 && currentTheme === 'village',
            'font-bold rounded bg-gray-700 text-gray-300 hover:bg-gray-600': store.wordLength !== 4 && currentTheme === 'dark',
            'font-bold rounded bg-gray-200 text-gray-700 hover:bg-gray-300': store.wordLength !== 4 && currentTheme === 'light',
            'font-bold rounded bg-amber-800 text-amber-200 hover:bg-amber-700 border border-amber-900': store.wordLength !== 4 && currentTheme === 'village',
            'font-bold rounded-none bg-[#ece9d8] text-black border-[3px] border-t-white border-l-white border-b-gray-500 border-r-gray-500': currentTheme === 'xp' && store.wordLength !== 4,
            'font-bold rounded-none bg-[#c0c0c0] text-black border-[3px] border-t-gray-500 border-l-gray-500 border-b-white border-r-white shadow-inner': currentTheme === 'xp' && store.wordLength === 4,
            'font-normal bg-gray-200 text-black border border-black rounded-none': currentTheme === 'raw' && store.wordLength !== 4,
            'font-bold bg-gray-400 text-black border border-black rounded-none': currentTheme === 'raw' && store.wordLength === 4
          }"
        >4 Huruf</button>
        
        <button 
          @click="store.initGame(5)"
          class="px-4 py-2 text-sm sm:text-base transition-colors"
          :class="{
            'font-bold rounded bg-blue-600 text-white': store.wordLength === 5 && currentTheme !== 'village' && currentTheme !== 'xp' && currentTheme !== 'raw',
            'font-bold rounded bg-green-700 text-white shadow-inner': store.wordLength === 5 && currentTheme === 'village',
            'font-bold rounded bg-gray-700 text-gray-300 hover:bg-gray-600': store.wordLength !== 5 && currentTheme === 'dark',
            'font-bold rounded bg-gray-200 text-gray-700 hover:bg-gray-300': store.wordLength !== 5 && currentTheme === 'light',
            'font-bold rounded bg-amber-800 text-amber-200 hover:bg-amber-700 border border-amber-900': store.wordLength !== 5 && currentTheme === 'village',
            'font-bold rounded-none bg-[#ece9d8] text-black border-[3px] border-t-white border-l-white border-b-gray-500 border-r-gray-500': currentTheme === 'xp' && store.wordLength !== 5,
            'font-bold rounded-none bg-[#c0c0c0] text-black border-[3px] border-t-gray-500 border-l-gray-500 border-b-white border-r-white shadow-inner': currentTheme === 'xp' && store.wordLength === 5,
            'font-normal bg-gray-200 text-black border border-black rounded-none': currentTheme === 'raw' && store.wordLength !== 5,
            'font-bold bg-gray-400 text-black border border-black rounded-none': currentTheme === 'raw' && store.wordLength === 5
          }"
        >5 Huruf</button>
        
        <button 
          @click="store.initGame(6)"
          class="px-4 py-2 text-sm sm:text-base transition-colors"
          :class="{
            'font-bold rounded bg-blue-600 text-white': store.wordLength === 6 && currentTheme !== 'village' && currentTheme !== 'xp' && currentTheme !== 'raw',
            'font-bold rounded bg-green-700 text-white shadow-inner': store.wordLength === 6 && currentTheme === 'village',
            'font-bold rounded bg-gray-700 text-gray-300 hover:bg-gray-600': store.wordLength !== 6 && currentTheme === 'dark',
            'font-bold rounded bg-gray-200 text-gray-700 hover:bg-gray-300': store.wordLength !== 6 && currentTheme === 'light',
            'font-bold rounded bg-amber-800 text-amber-200 hover:bg-amber-700 border border-amber-900': store.wordLength !== 6 && currentTheme === 'village',
            'font-bold rounded-none bg-[#ece9d8] text-black border-[3px] border-t-white border-l-white border-b-gray-500 border-r-gray-500': currentTheme === 'xp' && store.wordLength !== 6,
            'font-bold rounded-none bg-[#c0c0c0] text-black border-[3px] border-t-gray-500 border-l-gray-500 border-b-white border-r-white shadow-inner': currentTheme === 'xp' && store.wordLength === 6,
            'font-normal bg-gray-200 text-black border border-black rounded-none': currentTheme === 'raw' && store.wordLength !== 6,
            'font-bold bg-gray-400 text-black border border-black rounded-none': currentTheme === 'raw' && store.wordLength === 6
          }"
        >6 Huruf</button>
      </div>
      
      <div class="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 w-full transition-all duration-500">
        
        <div class="flex-shrink-0">
          <Board :theme="currentTheme" />
        </div>

        <!-- Panel Keputusan -->
        <div 
          v-if="store.gameStatus !== 'playing'" 
          class="p-6 w-full max-w-sm text-center animate-[fadeIn_0.5s_ease-in-out]"
          :class="{
            'bg-gray-800 border-2 border-gray-600 rounded-lg shadow-lg': currentTheme === 'dark',
            'bg-white border-2 border-gray-200 rounded-lg shadow-lg': currentTheme === 'light',
            'bg-amber-100 border-2 border-amber-600 text-amber-900 rounded-lg shadow-lg': currentTheme === 'village',
            'bg-[#ece9d8] text-black border-[3px] border-t-white border-l-white border-b-gray-600 border-r-gray-600 rounded-none shadow-lg': currentTheme === 'xp',
            'bg-white border border-black rounded-none': currentTheme === 'raw'
          }"
        >
          <h2 class="text-3xl mb-2 uppercase"
              :class="{
                'font-extrabold text-green-500': store.gameStatus === 'won' && currentTheme !== 'village' && currentTheme !== 'xp' && currentTheme !== 'raw',
                'font-extrabold text-green-700': store.gameStatus === 'won' && currentTheme === 'village',
                'font-extrabold text-blue-700': store.gameStatus === 'won' && currentTheme === 'xp',
                'font-bold text-black': store.gameStatus === 'won' && currentTheme === 'raw',
                'font-extrabold text-red-500': store.gameStatus !== 'won' && currentTheme !== 'xp' && currentTheme !== 'raw',
                'font-extrabold text-red-600': store.gameStatus !== 'won' && currentTheme === 'xp',
                'font-bold text-black': store.gameStatus !== 'won' && currentTheme === 'raw'
              }">
            {{ store.gameStatus === 'won' ? 'Tahniah!' : 'Cuba Lagi!' }}
          </h2>
          
          <p class="mb-2" :class="{ 'font-semibold text-gray-300': currentTheme === 'dark', 'font-semibold text-gray-600': currentTheme === 'light', 'font-semibold text-amber-800': currentTheme === 'village', 'font-semibold text-black': currentTheme === 'xp', 'font-normal text-black': currentTheme === 'raw' }">Jawapannya ialah:</p>
          <div class="text-4xl tracking-widest mb-6"
               :class="{ 'font-extrabold text-blue-500': currentTheme === 'dark' || currentTheme === 'light', 'font-extrabold text-green-800': currentTheme === 'village', 'font-extrabold text-black': currentTheme === 'xp', 'font-bold text-black': currentTheme === 'raw' }">
            {{ store.solution }}
          </div>
          
          <div class="border-t pt-4 text-left" :class="{ 'border-gray-600': currentTheme === 'dark', 'border-gray-200': currentTheme === 'light', 'border-amber-300': currentTheme === 'village', 'border-gray-400': currentTheme === 'xp', 'border-black': currentTheme === 'raw' }">
            <span class="text-lg px-2 py-1"
                  :class="{ 'font-semibold bg-gray-700 text-white rounded': currentTheme === 'dark', 'font-semibold bg-gray-200 text-gray-900 rounded': currentTheme === 'light', 'font-semibold bg-amber-200 text-amber-900 rounded': currentTheme === 'village', 'font-semibold bg-transparent text-black border border-gray-400 rounded-none': currentTheme === 'xp', 'font-bold text-black': currentTheme === 'raw' }">Makna:</span>
            <p class="mt-3 text-md leading-relaxed" :class="{ 'text-gray-300': currentTheme === 'dark', 'text-gray-700': currentTheme === 'light', 'text-amber-900': currentTheme === 'village', 'text-black': currentTheme === 'xp' || currentTheme === 'raw' }">
              {{ store.meaning }}
            </p>
          </div>
          
          <button 
            @click="store.initGame(store.wordLength)" 
            class="mt-8 py-3 px-4 w-full transition-colors uppercase tracking-wide border"
            :class="{
              'font-bold rounded bg-white text-gray-900 hover:bg-gray-200 border-transparent': currentTheme === 'dark',
              'font-bold rounded bg-gray-900 text-white hover:bg-gray-700 border-transparent': currentTheme === 'light',
              'font-bold rounded bg-green-700 text-white hover:bg-green-800 border-green-900': currentTheme === 'village',
              'font-bold rounded-none bg-[#ece9d8] text-black border-[3px] border-t-white border-l-white border-b-gray-600 border-r-gray-600': currentTheme === 'xp',
              'font-normal rounded-none bg-gray-200 text-black border border-black': currentTheme === 'raw'
            }"
          >
            Main Semula
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="w-full text-center py-6 mt-auto border-t text-sm transition-colors duration-500"
            :class="{
              'border-gray-800 text-gray-500': currentTheme === 'dark',
              'border-gray-300 text-gray-600': currentTheme === 'light',
              'border-amber-800 text-amber-300': currentTheme === 'village',
              'border-blue-400 text-blue-200': currentTheme === 'xp',
              'border-black text-black': currentTheme === 'raw'
            }">
      <p>Design with Gemini, Vue 3 & Tailwind CSS.</p>
    </footer>
  </div>
</template>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Animasi baru untuk Toast */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
