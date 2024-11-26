import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ImagenUsuario } from "./user-image.entity";




@Entity('T01_Usuarios')
export class Usuario {


    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique:true
    })
    correo?:string;

    @Column('text',{
        select:false
    })
    password?:string;

    @Column('text')
    nombre?:string;

    @Column('bool',{
        default:false
    })
    activo?:boolean;

    @Column('text',{
        array:true,
        default:['usuario']
    })
    roles?:string[];

    @Column('uuid',{
         unique: true,
         nullable: true
    })
    token?: string;

    @Column('uuid',{ 
        unique: true,  
        nullable: true 
    })
    resetPasswordToken: string;

    @CreateDateColumn({ type: 'timestamp',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    updatedAt: Date;

    @OneToMany(
        ()=>ImagenUsuario,
        (usuario_imagen)=>usuario_imagen.usuario,
        {cascade:true,eager:true}
    )
    imagenes?:ImagenUsuario[];

    
     //TODO:RELACIONES CON AGENTES


   

    @BeforeInsert()
    checkFieldBeforeInsert(){
        this.correo=this.correo.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.correo=this.correo.toLowerCase().trim();
    }
}
