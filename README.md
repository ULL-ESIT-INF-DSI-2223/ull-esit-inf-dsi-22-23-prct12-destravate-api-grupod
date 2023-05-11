[![Tests](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupod/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupod/actions/workflows/tests.yml)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupod/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupod?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupod&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupod)

# Práctica 12: API Node/Express de registro de actividades deportivas

## Descripción

Para esta práctica, tendremos que desarrollar una API REST que permita registrar actividades deportivas de los usuarios. Haremos uso de Node/Express para procesar operaciones CRUD sobre una base de datos MongoDB. Además, usaremos Mongoose para definir los modelos de datos y validarlos. Al final, desplegaremos el API en cyclic.

## Requisitos

La API permitirá la creación, modificación, borrado y consulta de usuarios, rutas, retos y grupos. Las operaciones de modificación, borrado y consulta las podremos hacer en función del id del recurso o de su nombre.

### Usuarios

Las operaciones que podremos realizar sobre los usuarios se realizarán en la ruta `/users`. Los usuarios tendrán los siguientes atributos:

1. ID único del usuario (puede ser un username creado por el usuario en el registro o un valor generado automáticamente por el sistema).
2. Nombre del usuario.
3. Actividades que realiza: Correr o bicicleta.
4. Amigos en la aplicación: Colleción de IDs de usuarios con los que interacciona.
5. Grupos de amigos: Diferentes colecciones de IDs de usuarios con los que suele realizar rutas.
6. Estadísticas de entrenamiento: Cantidad de km y desnivel total acumulados en la semana, mes y año.
7. Rutas favoritas: IDs de las rutas que el usuario ha realizado con mayor frecuencia.
8. Retos activos: IDs de los retos que el usuario está realizando actualmente.
9. Histórico de rutas: Los usuarios deben almacenar el historial de rutas realizadas desde que se registraron en el sistema. La información almacenada en esta estructura de datos deberá contener la información de la fecha y el ID de la ruta realizada

### Rutas

Las operaciones que podremos realizar sobre las rutas se realizarán en la ruta `/tracks`. Las rutas tendrán los siguientes atributos:

1. ID único de la ruta.
2. Nombre de la ruta.
3. Geolocalización del final de la ruta (coordenadas).
4. Geolocalización del inicio (coordenadas).
5. Longitud de la ruta en kilómetros.
6. Desnivel medio de la ruta.
7. Usuarios que han realizado la ruta (IDs).
8. Tipo de actividad: Indicador si la ruta se puede realizar en bicicleta o corriendo.
9. Calificación media de la ruta.

### Retos

Las operaciones que podremos realizar sobre los retos se realizarán en la ruta `/challenges`. Los retos tendrán los siguientes atributos:

1. ID único del reto.
2. Nombre del reto.
3. Rutas que forman parte del reto.
4. Tipo de actividad del reto: bicicleta o correr.
5. Km totales a realizar (como la suma de los kms de las rutas que lo engloban).
6. Usuarios que están realizando el reto.

### Grupos

Las operaciones que podremos realizar sobre los grupos se realizarán en la ruta `/groups`. Los grupos tendrán los siguientes atributos:

1. ID único del grupo.
2. Nombre del grupo.
3. Participantes: IDs de los miembros del grupo.
4. Estadísticas de entrenamiento grupal: Cantidad de km y desnivel total acumulados de manera grupal en la semana, mes y año
5. Clasificación de los usuarios: Ranking de los usuarios que más entrenamientos han realizado históricamente dentro del grupo, es decir, ordenar los usuarios por la cantidad de km totales o desnivel total que han acumulado.
6. Rutas favoritas del grupo: Rutas que los usuarios del grupo han realizado con mayor frecuencia en sus salidas conjuntas.
7. Histórico de rutas realizadas por el grupo: Información similar que almacenan los usuarios pero en este caso referente a los grupos.

## Modelos y esquemas

En primer lugar, tendremos que definir los esquemas y modelos para cada uno de los tipos de datos que podemos almacenar en nuestra base de datos. En el esquema, podremos definir el tipo de cada propiedad y si es requerida o no. Además, podremos definir valores por defecto para cada propiedad y crear validadores que ajusten los posibles valores que puedan tener.

### Modelo de usuarios

```typescript
export interface UsuarioInterface extends Document {
  usuario_id: number;
  usuario_nombre: string;
  actividad: "correr" | "bicicleta";
  amigos: UsuarioInterface[];
  grupos: GrupoInterface[];
  estadisticas: {
    km_semana: number;
    km_mes: number;
    km_ano: number;
    desnivel_semana: number;
    desnivel_mes: number;
    desnivel_ano: number;
  };
  rutas_favoritas: TrackInterface[];
  retos_activos: RetoInterface[];
  historico_rutas: { fehca: Date; ruta: TrackInterface }[];
}

const UsuarioSchema = new Schema<UsuarioInterface>({
  usuario_id: {
    type: Number,
    required: true,
    unique: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("usuario_id must be a positive number");
      }
    },
  },
  usuario_nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value: string) {
      if (value.length < 3) {
        throw new Error("usuario_nombre must be at least 3 characters long");
      }
    },
  },
  actividad: {
    type: String,
    required: true,
    trim: true,
    enum: ["correr", "bicicleta"],
  },
  amigos: { type: [Schema.Types.ObjectId], default: [], ref: "Usuario" },
  grupos: { type: [Schema.Types.ObjectId], default: [], ref: "Grupo" },
  estadisticas: {
    km_semana: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    km_mes: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    km_ano: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_semana: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_mes: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_ano: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
  },
  rutas_favoritas: { type: [Schema.Types.ObjectId], default: [], ref: "Track" },
  retos_activos: { type: [Schema.Types.ObjectId], default: [], ref: "Reto" },
  historico_rutas: {
    type: [{ fecha: Date, ruta: Schema.Types.ObjectId }],
    default: [],
    ref: "Track",
  },
});

export const Usuario = model<UsuarioInterface>("Usuario", UsuarioSchema);
```

En primer lugar, definimos una interfaz que nos permitirá definir el tipo de los datos que se almacenarán en la base de datos. Luego, definimos el esquema que tendrá cada documento de la colección. Para cada propiedad, definimos el tipo de dato que almacenará, si es requerido o no, si tiene un valor por defecto, si tiene un valor único, o si tiene un validador que compruebe que el valor que se le pasa es correcto. En el caso de atributos que dependan de otros objetos, por ejemplo la lista de amigos, definimos el tipo como `Schema.Types.ObjectId` y le indicamos que se refiere a la colección `Usuario`. Lo mismo ocurre con los grupos, las rutas favoritas, los retos activos y el histórico de rutas. Finalmente, creamos el modelo a partir del esquema y lo exportamos.

### Modelo de grupos

```typescript
export interface GrupoInterface extends Document {
  grupo_id: number;
  grupo_nombre: string;
  participantes: UsuarioInterface[];
  estadisticas_grupales: {
    km_semana: number;
    km_mes: number;
    km_ano: number;
    desnivel_semana: number;
    desnivel_mes: number;
    desnivel_ano: number;
  };
  rutas_favoritas: TrackInterface[];
  historico_rutas: { fecha: Date; ruta: TrackInterface }[];
}

const GrupoSchema = new Schema<GrupoInterface>({
  grupo_id: {
    type: Number,
    required: true,
    unique: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("grupo_id must be a positive number");
      }
    },
  },
  grupo_nombre: {
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      if (value.length < 3) {
        throw new Error("grupo_nombre must be at least 3 characters long");
      }
    },
  },
  participantes: { type: [Schema.Types.ObjectId], ref: "Usuario" },
  estadisticas_grupales: {
    km_semana: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    km_mes: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    km_ano: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_semana: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_mes: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_ano: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
  },
  rutas_favoritas: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Track",
  },
  historico_rutas: {
    type: [{ fecha: Date, ruta: Schema.Types.ObjectId }],
    default: [],
    ref: "Track",
  },
});

export const Grupo = model<GrupoInterface>("Grupo", GrupoSchema);
```

De forma similar, definimos una interfaz que describa el tipo de datos que almacena un documento de grupo. Luego, definimos el esquema detallando los atributos de cada una de las propiedades y, al final, creamos el modelo y lo exportamos.

### Modelo de retos

```typescript
export interface RetoInterface extends Document {
  reto_id: number;
  reto_nombre: string;
  rutas: TrackInterface[];
  tipo: "correr" | "bicicleta";
  km_totales: number;
  usuarios_realizando: UsuarioInterface[];
}

const RetoSchema = new Schema<RetoInterface>({
  reto_id: {
    type: Number,
    required: true,
    unique: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("reto_id must be a positive number");
      }
    },
  },
  reto_nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value: string) {
      if (value.length < 3) {
        throw new Error("reto_nombre must be at least 3 characters long");
      }
    },
  },
  rutas: { type: [Schema.Types.ObjectId], ref: "Track", default: [] },
  tipo: {
    type: String,
    trim: true,
    required: true,
    enum: ["correr", "bicicleta"],
  },
  km_totales: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("km_totales must be a positive number");
      }
    },
  },
  usuarios_realizando: {
    type: [Schema.Types.ObjectId],
    ref: "Usuario",
    default: [],
  },
});

export const Reto = model<RetoInterface>("Reto", RetoSchema);
```

De igual manera, definimos el modelo de retos.

### Modelo de rutas

```typescript
export interface TrackInterface extends Document {
  track_id: number;
  track_nombre: string;
  localizacionInicio: string;
  localizacionFin: string;
  desnivel: number;
  usuarios_realizados: UsuarioInterface[];
  tipo: "correr" | "bicicleta";
  calificacion: number;
}

const TrackSchema = new Schema<TrackInterface>({
  track_id: {
    type: Number,
    required: true,
    unique: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("track_id must be a positive number");
      }
    },
  },
  track_nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value: string) {
      if (value.length < 3) {
        throw new Error("track_nombre must be at least 3 characters long");
      }
    },
  },
  localizacionInicio: { type: String, trim: true, required: true },
  localizacionFin: { type: String, trim: true, required: true },
  desnivel: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("desnivel must be a positive number");
      }
    },
  },
  usuarios_realizados: {
    type: [Schema.Types.ObjectId],
    ref: "Usuario",
    default: [],
  },
  tipo: {
    type: String,
    trim: true,
    required: true,
    enum: ["correr", "bicicleta"],
  },
  calificacion: { type: Number, min: 0, max: 5, default: 0 },
});

export const Track = model<TrackInterface>("Track", TrackSchema);
```

Finalmente, definimos el modelo de rutas.

## Routers

Una vez definido cada uno de los modelos, tendremos que crear los routers que permitan realizar las operaciones CRUD sobre cada uno de ellos.

### Router de usuarios

```typescript
type FilterType =
  | {
      usuario_id?: string;
    }
  | {
      usuario_nombre?: string;
    };

export const usuariosRouter = express.Router();

usuariosRouter.post("/users", async (req, res) => {
  const usuario = new Usuario(req.body);
  try {
    await usuario.save();
    return res.status(201).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
});

usuariosRouter.get("/users", async (req, res) => {
  let filter: FilterType = {};
  if (req.query.usuario_id) {
    filter = { usuario_id: req.query.usuario_id.toString() };
  } else if (req.query.usuario_nombre) {
    filter = { usuario_nombre: req.query.usuario_nombre.toString() };
  }
  try {
    const usuarios = await Usuario.find(filter);
    if (usuarios.length !== 0) {
      return res.status(200).send(usuarios);
    }
    return res.status(404).send({ error: "No users found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

usuariosRouter.patch("/users", async (req, res) => {
  if (!req.query.usuario_nombre && !req.query.usuario_id) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: usuario_id, usuario_nombre",
    });
  }
  const allowedUpdates = ["usuario_nombre", "actividad"];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({
      error: "Update is not permitted",
    });
  }
  try {
    let filter: FilterType = {};
    if (req.query.usuario_id) {
      filter = { usuario_id: req.query.usuario_id.toString() };
    } else if (req.query.usuario_nombre) {
      filter = { usuario_nombre: req.query.usuario_nombre.toString() };
    }
    const user = await Usuario.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send({ error: "User not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

usuariosRouter.delete("/users", async (req, res) => {
  if (!req.query.usuario_nombre && !req.query.usuario_id) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: usuario_id, usuario_nombre",
    });
  }
  try {
    let filter: FilterType = {};
    if (req.query.usuario_id) {
      filter = { usuario_id: req.query.usuario_id.toString() };
    } else if (req.query.usuario_nombre) {
      filter = { usuario_nombre: req.query.usuario_nombre.toString() };
    }
    // Eliminar usuario de la lista de amigos de otros usuarios
    const deleted_user = await Usuario.findOne(filter);
    const users = await Usuario.find({});
    users.forEach(async (user) => {
      const index = user.amigos.indexOf(deleted_user?._id);
      if (index > -1) {
        user.amigos.splice(index, 1);
        await user.save();
      }
    });
    // Eliminar usuario de la lista de usuarios de los grupos
    const grupos = await Grupo.find({});
    grupos.forEach(async (grupo) => {
      const index = grupo.participantes.indexOf(deleted_user?._id);
      if (index > -1) {
        grupo.participantes.splice(index, 1);
        await grupo.save();
      }
    });
    // Eliminar usuario de la lista de usuarios de los retos
    const retos = await Reto.find({});
    retos.forEach(async (reto) => {
      const index = reto.usuarios_realizando.indexOf(deleted_user?._id);
      if (index > -1) {
        reto.usuarios_realizando.splice(index, 1);
        await reto.save();
      }
    });
    // Eliminar usuario de la lista de usuarios de las rutas
    const tracks = await Track.find({});
    tracks.forEach(async (track) => {
      const index = track.usuarios_realizados.indexOf(deleted_user?._id);
      if (index > -1) {
        track.usuarios_realizados.splice(index, 1);
        await track.save();
      }
    });

    const user = await Usuario.findOneAndDelete(filter);
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send({ error: "User not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
```

Asignaremos las peticiones /POST a la creación de un usuario, /GET a la obtención de usuarios, /PATCH a la actualización de usuarios y /DELETE a la eliminación de usuarios.

- Para la creación de usuarios, se creará un nuevo usuario a partir de los datos recibidos en el cuerpo de la petición.
- Para la obtención de usuarios, se comprobará si se ha recibido un parámetro de búsqueda, y en caso afirmativo, se buscará el usuario por el parámetro recibido. En caso negativo, se devolverán todos los usuarios.
- Para la actualización de usuarios, se comprobará si se ha recibido un parámetro de búsqueda, y en caso afirmativo, se buscará el usuario por el parámetro recibido. En caso negativo, se devolverá un error. En caso de que se haya encontrado el usuario, se actualizarán los campos recibidos en el cuerpo de la petición.
- Para la eliminación de usuarios, se comprobará si se ha recibido un parámetro de búsqueda, y en caso afirmativo, se buscará el usuario por el parámetro recibido. En caso negativo, se devolverá un error. En caso de que se haya encontrado el usuario, se eliminará de la base de datos, y se eliminará de la lista de amigos de los usuarios, de la lista de participantes de los grupos, de la lista de usuarios de los retos y de la lista de usuarios de las rutas.

En cada una de las peticiones, se devolverá un código de estado HTTP 200 en caso de que la petición se haya realizado correctamente, y un código de estado HTTP 400 en caso de que la petición no se haya realizado correctamente. Por otra parte, se devolverá un código de estado HTTP 404 en caso de que no se haya encontrado el usuario, y un código de estado HTTP 500 en caso de que haya ocurrido un error en el servidor.

### Rutas de grupos

```typescript
type NameIdType =
  | {
      grupo_id?: string;
    }
  | {
      grupo_nombre?: string;
    };

gruposRouter.post("/groups", async (req, res) => {
  const grupo = new Grupo(req.body);
  try {
    await grupo.save();
    return res.status(201).send(grupo);
  } catch (error) {
    return res.status(500).send(error);
  }
});

gruposRouter.get("/groups", async (req, res) => {
  let filter: NameIdType = {};
  if (req.query.grupo_id) {
    filter = { grupo_id: req.query.grupo_id.toString() };
  } else if (req.query.grupo_nombre) {
    filter = { grupo_nombre: req.query.grupo_nombre.toString() };
  }
  try {
    const grupos = await Grupo.find(filter);
    if (grupos.length !== 0) {
      return res.status(200).send(grupos);
    }
    return res.status(404).send({ error: "No groups found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

gruposRouter.patch("/groups", async (req, res) => {
  if (!req.query.grupo_id && !req.query.grupo_nombre) {
    return res.status(400).send({
      error: "You must provide at least one of the following: grupo_id",
    });
  }
  const allowedUpdates = [
    "grupo_nombre",
    "participantes",
    "estadisticas_grupales",
    "rutas_favoritas",
    "historico_rutas",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    let filter: NameIdType = {};
    if (req.query.grupo_id) {
      filter = { grupo_id: req.query.grupo_id.toString() };
    } else if (req.query.grupo_nombre) {
      filter = { grupo_nombre: req.query.grupo_nombre.toString() };
    }
    const grupo = await Grupo.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });

    if (grupo) {
      return res.status(200).send(grupo);
    }
    return res.status(404).send({ error: "Group not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

gruposRouter.delete("/groups", async (req, res) => {
  if (!req.query.grupo_id && !req.query.grupo_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: grupo_id, grupo_nombre",
    });
  }
  try {
    let filter: NameIdType = {};
    if (req.query.grupo_id) {
      filter = { grupo_id: req.query.grupo_id.toString() };
    } else if (req.query.grupo_nombre) {
      filter = { grupo_nombre: req.query.grupo_nombre.toString() };
    }

    // Eliminar el grupo de los usuarios
    const deleted_group = await Grupo.findOne(filter);
    const usuarios = await Usuario.find({});
    usuarios.forEach(async (usuario) => {
      const index = usuario.grupos.indexOf(deleted_group?._id);
      if (index > -1) {
        usuario.grupos.splice(index, 1);
      }
      await usuario.save();
    });

    const grupo = await Grupo.findOneAndDelete(filter);
    if (grupo) {
      return res.status(200).send(grupo);
    }
    return res.status(404).send({ error: "Group not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
```

El router de grupos tendrá las mismas peticiones que el router de usuarios, con la diferencia de que en la petición de eliminación de grupos, se eliminará el grupo de la lista de grupos de los usuarios.

### Rutas de retos

```typescript
type NameIdType =
  | {
      reto_id?: string;
    }
  | {
      reto_nombre?: string;
    };

retosRouter.post("/challenges", async (req, res) => {
  const reto = new Reto(req.body);
  try {
    await reto.save();
    return res.status(201).send(reto);
  } catch (error) {
    return res.status(500).send(error);
  }
});

retosRouter.get("/challenges", async (req, res) => {
  let filter: NameIdType = {};
  if (req.query.reto_id) {
    filter = { reto_id: req.query.reto_id.toString() };
  } else if (req.query.reto_nombre) {
    filter = { reto_nombre: req.query.reto_nombre.toString() };
  }
  try {
    const retos = await Reto.find(filter);
    if (retos.length !== 0) {
      return res.status(200).send(retos);
    }
    return res.status(404).send({ error: "No retos found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

retosRouter.patch("/challenges", async (req, res) => {
  if (!req.query.reto_id && !req.query.reto_nombre) {
    return res.status(400).send({
      error: "You must provide at least one of the following: reto_id",
    });
  }
  const allowedUpdates = [
    "reto_nombre",
    "rutas",
    "tipo",
    "km_totales",
    "usuarios_realizando",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    let filter: NameIdType = {};
    if (req.query.reto_id) {
      filter = { reto_id: req.query.reto_id.toString() };
    } else if (req.query.reto_nombre) {
      filter = { reto_nombre: req.query.reto_nombre.toString() };
    }

    const reto = await Reto.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (reto) {
      return res.status(200).send(reto);
    }
    return res.status(404).send({ error: "Reto not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

retosRouter.delete("/challenges", async (req, res) => {
  if (!req.query.reto_id && !req.query.reto_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: reto_id, reto_nombre",
    });
  }

  try {
    let filter: NameIdType = {};
    if (req.query.reto_id) {
      filter = { reto_id: req.query.reto_id.toString() };
    } else if (req.query.reto_nombre) {
      filter = { reto_nombre: req.query.reto_nombre.toString() };
    }
    //Eliminar reto de los usuarios que lo estén realizando
    const deleted_reto = await Reto.findOne(filter);
    const usuarios = await Usuario.find({});
    usuarios.forEach(async (usuario) => {
      const index1 = usuario.retos_activos.indexOf(deleted_reto?._id);
      if (index1 > -1) {
        usuario.retos_activos.splice(index1, 1);
        await usuario.save();
      }
    });

    const reto = await Reto.findOneAndDelete(filter);
    if (reto) {
      return res.status(200).send(reto);
    }

    return res.status(404).send({ error: "Reto not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
```

El router de retos tendrá las mismas peticiones que los otros routers, con la diferencia de que en la petición de eliminación de retos, se eliminará el reto de la lista de retos activos de los usuarios.

### Rutas de rutas

```typescript
type NameIdType =
  | {
      track_id?: string;
    }
  | {
      track_nombre?: string;
    };

trackRouter.post("/tracks", async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.get("/tracks", async (req, res) => {
  let filter: NameIdType = {};
  if (req.query.track_id) {
    filter = { track_id: req.query.track_id.toString() };
  } else if (req.query.track_nombre) {
    filter = { track_nombre: req.query.track_nombre.toString() };
  }
  try {
    const tracks = await Track.find(filter).populate({
      path: "usuarios_realizados",
      select: "usuario_nombre",
    });
    if (tracks.length !== 0) {
      return res.status(200).send(tracks);
    }
    return res.status(404).send({ error: "No tracks found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.patch("/tracks", async (req, res) => {
  if (!req.query.track_id && !req.query.track_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: track_id, track_nombre",
    });
  }
  const allowedUpdates = [
    "track_nombre",
    "localizacionInicio",
    "localizacionFin",
    "desnivel",
    "usuarios_realizados",
    "tipo",
    "calificacion",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    let filter: NameIdType = {};
    if (req.query.track_id) {
      filter = { track_id: req.query.track_id.toString() };
    } else if (req.query.track_nombre) {
      filter = { track_nombre: req.query.track_nombre.toString() };
    }
    const track = await Track.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (track) {
      return res.status(200).send(track);
    }
    return res.status(404).send({ error: "Track not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.delete("/tracks", async (req, res) => {
  if (!req.query.track_id && !req.query.track_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: track_id or track_nombre",
    });
  }

  try {
    let filter: NameIdType = {};
    if (req.query.track_id) {
      filter = { track_id: req.query.track_id.toString() };
    } else if (req.query.track_nombre) {
      filter = { track_nombre: req.query.track_nombre.toString() };
    }

    //Eliminar el track de las rutas favoritas de los usuarios
    const deleted_track = await Track.findOne(filter);
    const usuarios = await Usuario.find({});
    usuarios.forEach(async (usuario) => {
      const index1 = usuario.rutas_favoritas.indexOf(deleted_track?._id);
      if (index1 > -1) {
        usuario.rutas_favoritas.splice(index1, 1);
        await usuario.save();
      }
      const index2 = usuario.historico_rutas.indexOf(deleted_track?._id);
      if (index2 > -1) {
        usuario.historico_rutas.splice(index2, 1);
        await usuario.save();
      }
    });
    //Eliminar el track de los retos
    const retos = await Reto.find({});
    retos.forEach(async (reto) => {
      const index = reto.rutas.indexOf(deleted_track?._id);
      if (index > -1) {
        reto.rutas.splice(index, 1);
        await reto.save();
      }
    });
    //Eliminar el track de los grupos
    const grupos = await Grupo.find({});
    grupos.forEach(async (grupo) => {
      const index = grupo.rutas_favoritas.indexOf(deleted_track?._id);
      if (index > -1) {
        grupo.rutas_favoritas.splice(index, 1);
        await grupo.save();
      }
      const index2 = grupo.historico_rutas.indexOf(deleted_track?._id);
      if (index2 > -1) {
        grupo.historico_rutas.splice(index2, 1);
        await grupo.save();
      }
    });

    const track = await Track.findOneAndDelete(filter);
    if (track) {
      return res.status(200).send(track);
    }
    return res.status(404).send({ error: "Track not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
```

El router de rutas tendrá las mismas peticiones que los otros routers, con la diferencia de que en la petición de eliminación de rutas, se eliminará la ruta de las rutas favoritas e histórico de los usuarios, de los grupos y de los retos.

## Conexion con la base de datos

Para la conexión con la base de datos se ha utilizado la librería mongoose.

```typescript
import { connect } from "mongoose";

try {
  await connect(process.env.MONGODB_URL!);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error connecting to MongoDB");
  console.log(error);
}
```

La dirección de la base de datos se encuentra en la variable de entorno MONGODB_URL. Esta variable se encuentra en el fichero .env, que se encuentra en el directorio `/config`.

## App

Para la creación del servidor express, creamos un fichero app.ts en el directorio `/src` con el siguiente contenido:

```typescript
export const app = express();
app.use(express.json());
app.use(usuariosRouter);
app.use(gruposRouter);
app.use(retosRouter);
app.use(trackRouter);
app.use(defaultRouter);
```

En este fichero se importan los routers y se añaden al servidor express. También se añade el middleware express.json() para que el servidor pueda recibir peticiones con el formato JSON. En el fichero index.ts se importa el servidor y se escucha en el puerto definido por la variable de entorno PORT.

```typescript
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Conclusiones

En este proyecto hemos aprendido a utilizar las librerías express y mongoose para crear un servidor REST con Node.js. El uso de estas librerías nos ha permitido crear un servidor de forma rápida y sencilla, pudiendo definir las rutas y los controladores de forma independiente además de poder definir esquemas que definan la estructura de los datos que se van a almacenar en la base de datos.

## Bibliografía

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
