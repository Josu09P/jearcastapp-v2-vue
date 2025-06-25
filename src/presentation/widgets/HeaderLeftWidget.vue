<template>
  <div
    class="d-flex flex-column align-items-start px-3 pt-2 text-dark border-end position-relative"
    id="navbar-left-color"
    style="height: 196vh"
  >
    <a
      href="#"
      class="pb-3 mb-3 text-white text-decoration-none text-center"
      style="width: 100%; margin-top: 6px"
    >
      <span class="fs-5 fw-bold" style="margin-left: -20px">Steel Music</span>
    </a>
    <ul class="nav nav-pills flex-column w-100 mb-5" style="margin-top: -15px;">
      <li class="nav-item">
        <a href="#home" class="nav-link nav-section">
          <i class="bi bi-house-door me-2"></i> Inicio
        </a>
      </li>
      <li>
        <a href="#favorites" class="nav-link nav-section">
          <i class="bi bi-heart me-2"></i> Favoritos
        </a>
      </li>
      <li>
        <a href="#play-list" class="nav-link nav-section">
          <i class="bi bi-music-note-list me-2"></i> Play List
        </a>
      </li>
      <li>
        <a href="#recommended" class="nav-link nav-section">
          <i class="bi bi-stars me-2"></i> Recomendados
        </a>
      </li>
      <li style="display: none">
        <a href="#music-local" class="nav-link nav-section">
          <i class="bi bi-collection-play-fill me-2"></i> Musica Local
        </a>
      </li>
      <li>
        <a href="#themes" class="nav-link nav-section">
          <i class="bi bi-gear-wide-connected me-2"></i> Configuración
        </a>
      </li>
      <li style="display: none">
        <a href="/dashboard/demo">demo</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.nav-link.active {
  background-color: #ffffff33;
  border-left: 3px solid #ffffff;
  color: #fff !important;
}

#navbar-left-color {
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
#navbar-left-color a {
  color: rgb(229, 229, 229) !important;
  font-size: 14px;
}

li {
  background-color: #b6b6b650;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.351);
  border-radius: 6px;
  margin-bottom: 10px;
}

li:hover {
  background-color: #c9c9c9ca;
  border-radius: 6px;
}
</style>
